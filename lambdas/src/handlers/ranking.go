package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"main/db"
	"main/lib"
	"main/models"
	"sort"

	"github.com/aws/aws-lambda-go/events"
)

func GetRankingByMatchDayAndSquadId(
	tournamentId *string,
	matchDayId *string,
	squadId *string,
) *events.APIGatewayProxyResponse {

	matchDay := db.GetDb().GetMatchDayById(tournamentId, matchDayId)
	if matchDay == nil {
		return lib.NotFound()
	}
	matchDays := []*models.MatchDay{matchDay}

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		return lib.NotFound()
	}
	pools := []*models.Pool{pool}

	rankingTable := db.GetDb().GetRankingByMatchDayAndSquadId(
		tournamentId, matchDayId, squadId)
	if rankingTable == nil {
		return lib.NotFound()
	}
	rankingTables := []*models.RankingTable{rankingTable}

	data := &models.Update{
		MatchDays:     matchDays,
		Pools:         pools,
		Users:         *users,
		RankingTables: rankingTables,
	}

	return lib.BuildUpdate(data)
}

func calculateRanking(
	tournamentId *string, matchDayId *string, updatedMatch *models.Match,
) error {

	matchDay := db.GetDb().GetMatchDayById(tournamentId, matchDayId)
	if matchDay == nil {
		return errors.New("Could not load match day data")
	}
	previousMatchDayId := &matchDay.PreviousId
	if matchDay.PreviousId == "" {
		previousMatchDayId = nil
	}

	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)
	for idx, value := range matches {
		if value.Id == updatedMatch.Id {
			matches[idx] = updatedMatch
			break
		}
	}

	matchesById := make(map[uint32]*models.Match)
	for _, match := range matches {
		matchesById[match.Id] = match
	}

	squads := db.GetDb().GetSquads()
	for _, squad := range squads {
		err := calculateRankingForSquad(
			tournamentId, matchDayId, previousMatchDayId, &matchesById, &squad.Id)
		if err != nil {
			return err
		}
	}

	return nil
}

func calculateRankingForSquad(
	tournamentId *string, matchDayId *string, previousMatchDayId *string,
	matchesById *map[uint32]*models.Match, squadId *string,
) error {

	pool, _ := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		return errors.New("Could not find pool")
	}

	bets := db.GetDb().GetBetsByMatchDayAndSquadId(
		tournamentId, matchDayId, squadId)
	if bets == nil {
		log.Println("Did not find bets for squad " + *squadId)
		bets = &models.MatchDayBetBucket{}
	}

	ranking := db.GetDb().GetRankingByMatchDayAndSquadId(
		tournamentId, previousMatchDayId, squadId)
	if ranking == nil {
		ranking = &models.RankingTable{}
	}

	log.Println("Calculating ranking for match day " + *matchDayId +
		" and squad " + *squadId)

	betsByUser := make(map[string]*models.UserBetBucket)
	for _, betBucket := range bets.Bets {
		betsByUser[betBucket.UserId] = betBucket
	}

	rankingEntriesByUser := make(map[string]*models.RankingEntry)
	for _, entry := range ranking.Entries {
		rankingEntriesByUser[entry.UserId] = entry
	}

	for _, userId := range pool.Participants {
		if rankingEntriesByUser[userId] == nil {
			rankingEntriesByUser[userId] = &models.RankingEntry{UserId: userId}
		}
		updateEntry(matchesById, &betsByUser, rankingEntriesByUser[userId])
	}

	rankingEntries := make([]*models.RankingEntry, len(rankingEntriesByUser))
	i := 0
	for _, entry := range rankingEntriesByUser {
		rankingEntries[i] = entry
		i = i + 1
	}

	sort.Sort(ByScore(rankingEntries))
	var position uint32 = 0
	var lastScore uint32 = 0
	for idx, entry := range rankingEntries {
		entry.PreviousPosition = entry.Position
		if idx == 0 || lastScore > entry.Score {
			position = uint32(idx) + 1
			lastScore = entry.Score
		}
		entry.Position = position
	}

	record := &models.RankingTable{
		Updated:      lib.Timestamp(),
		SquadId:      *squadId,
		TournamentId: *tournamentId,
		MatchDayId:   *matchDayId,
		Entries:      rankingEntries,
	}

	jsonDebug, _ := json.Marshal(record)
	log.Println("Generated ranking: " + string(jsonDebug))

	err := db.GetDb().WriteRankingTable(record)
	if err != nil {
		log.Println("Failed to write table: " + err.Error())
	}

	return nil
}

func updateEntry(
	matchesById *map[uint32]*models.Match,
	betsByUser *map[string]*models.UserBetBucket,
	entry *models.RankingEntry,
) {

	usersBets := (*betsByUser)[entry.UserId]
	if usersBets == nil {
		return
	}

	for _, bet := range usersBets.Bets {
		match := (*matchesById)[bet.MatchId]
		if match == nil || match.MatchStatus != models.MatchStatus_FINISHED {
			continue
		}
		if lib.IsExact(bet, match) {
			entry.Exact = entry.Exact + 1
			entry.Score = entry.Score + lib.EXACT_POINTS
		} else if lib.IsCorrectDifference(bet, match) {
			entry.Difference = entry.Difference + 1
			entry.Score = entry.Score + lib.DIFFERENCE_POINTS
		} else if lib.IsCorrectTendency(bet, match) {
			entry.Tendency = entry.Tendency + 1
			entry.Score = entry.Score + lib.TENDENCY_POINTS
		}
	}
}

type ByScore []*models.RankingEntry

func (a ByScore) Len() int           { return len(a) }
func (a ByScore) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByScore) Less(i, j int) bool { return a[i].Score > a[j].Score }
