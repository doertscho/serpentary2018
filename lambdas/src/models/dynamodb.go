package models

import (
	"errors"
	"log"
	"strconv"
	"strings"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func JoinKeys(keyA *string, keyB *string) *string {
	joined := *keyA + "/" + *keyB
	return &joined
}

func SplitKey(value *string) *[]string {
	if value == nil {
		return nil
	}
	split := strings.SplitN(*value, "/", 2)
	return &split
}

func (ls *LocalisableString) MarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	av.M = make(map[string]*sdk.AttributeValue, len(ls.Localisations))
	for _, val := range ls.Localisations {
		key := strconv.Itoa(int(val.Locale))
		value := &sdk.AttributeValue{S: &val.Value}
		av.M[key] = value
	}

	return nil
}

func (ls *LocalisableString) UnmarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	if av.M == nil {
		return nil
	}

	ls.Localisations = make([]*Localisation, len(av.M))
	i := 0
	for key, entry := range av.M {
		locale, err := strconv.Atoi(key)
		if err != nil {
			return err
		}
		if entry.S == nil {
			return errors.New("Invalid value")
		}
		value := entry.S
		ls.Localisations[i] = &Localisation{Locale: Locale(locale), Value: *value}
		i = i + 1
	}

	return nil
}

func (eqbb *ExtraQuestionBetBucket) MarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	log.Println("Custom EQBB marshaller")

	mapData := make(map[string]*sdk.AttributeValue, len(eqbb.GetBets()))
	for _, val := range eqbb.GetBets() {
		key := val.UserId
		value := &sdk.AttributeValue{}
		err := val.MarshalDynamoDBAttributeValue(value)
		if err != nil {
			return err
		}
		mapData[key] = value
	}

	updated := strconv.Itoa(int(eqbb.Updated))

	av.M = map[string]*sdk.AttributeValue{
		"squad_id":      &sdk.AttributeValue{S: &eqbb.SquadId},
		"tournament_id": &sdk.AttributeValue{S: &eqbb.TournamentId},
		"updated":       &sdk.AttributeValue{N: &updated},
		"bets":          &sdk.AttributeValue{M: mapData},
	}

	return nil
}

func (eqbb *ExtraQuestionBetBucket) UnmarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	log.Println("Custom UBB unmarshaller")

	if av.M == nil {
		return nil
	}

	squadId := av.M["squad_id"]
	if squadId == nil || squadId.S == nil {
		return errors.New("No or invalid squad id")
	}
	eqbb.SquadId = *(squadId.S)

	tournamentId := av.M["tournament_id"]
	if tournamentId == nil || tournamentId.S == nil {
		return errors.New("No or invalid tournament id")
	}
	eqbb.TournamentId = *(tournamentId.S)

	updatedVal := av.M["updated"]
	if updatedVal == nil || updatedVal.N == nil {
		return errors.New("No or invalid timestamp")
	}
	updated, err := strconv.Atoi(*updatedVal.N)
	if err != nil {
		return err
	}
	eqbb.Updated = uint32(updated)

	if av.M["bets"] == nil || av.M["bets"].M == nil {
		return nil
	}

	betsMap := av.M["bets"].M

	eqbb.Bets = make([]*ExtraQuestionUserBetBucket, len(betsMap))
	i := 0
	for _, entry := range betsMap {
		userBetBucket := &ExtraQuestionUserBetBucket{}
		err = userBetBucket.UnmarshalDynamoDBAttributeValue(entry)
		if err != nil {
			return err
		}
		eqbb.Bets[i] = userBetBucket
		i = i + 1
	}

	return nil
}

func (ubb *ExtraQuestionUserBetBucket) MarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	log.Println("Custom UBB marshaller")

	mapData := make(map[string]*sdk.AttributeValue, len(ubb.GetBets()))
	for _, val := range ubb.GetBets() {
		key := strconv.Itoa(int(val.QuestionId))
		value := &sdk.AttributeValue{}
		if val.PlayerId > 0 {
			playerId := strconv.Itoa(int(val.PlayerId))
			value.S = JoinKeys(&val.TeamId, &playerId)
		} else if len(val.TeamId) > 0 {
			value.S = &val.TeamId
		} else {
			value.S = &val.Text
		}
		mapData[key] = value
	}

	av.M = map[string]*sdk.AttributeValue{
		"user_id": &sdk.AttributeValue{S: &ubb.UserId},
		"bets":    &sdk.AttributeValue{M: mapData},
	}

	return nil
}

func (ubb *ExtraQuestionUserBetBucket) UnmarshalDynamoDBAttributeValue(
	av *sdk.AttributeValue) error {

	log.Println("Custom UBB unmarshaller")

	if av.M == nil {
		return nil
	}

	userId := av.M["user_id"]
	if userId == nil || userId.S == nil {
		return errors.New("No or invalid user id")
	}

	ubb.UserId = *(userId.S)

	if av.M["bets"] == nil || av.M["bets"].M == nil {
		return nil
	}

	betsMap := av.M["bets"].M

	ubb.Bets = make([]*ExtraQuestionBet, len(betsMap))
	i := 0
	for key, entry := range betsMap {
		questionId, err := strconv.Atoi(key)
		if err != nil {
			return err
		}
		if entry.S == nil {
			return errors.New("Invalid value")
		}
		bet := ExtraQuestionBet{
			QuestionId: uint32(questionId),
		}
		split := SplitKey(entry.S)
		if len(*split) == 2 {
			playerId, err := strconv.Atoi((*split)[1])
			if err != nil {
				bet.Text = *entry.S
			} else {
				bet.TeamId = (*split)[0]
				bet.PlayerId = uint32(playerId)
			}
		} else {
			bet.TeamId = (*split)[0]
			bet.Text = (*split)[0]
		}
		ubb.Bets[i] = &bet
		i = i + 1
	}

	return nil
}
