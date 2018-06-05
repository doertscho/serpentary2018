package dynamodb

import (
	"log"
	"main/models"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetExtraBetsByPoolId(
	squadId *string, tournamentId *string,
) *models.ExtraQuestionBetBucket {

	record, err := db.getItemByCompoundKey(
		"extra-bets", "squad_id", squadId, "tournament_id", tournamentId)
	if err != nil {
		log.Println("Error fetching extra bets record: " + err.Error())
		return nil
	}

	betBucket := models.ExtraQuestionBetBucket{}
	err = attr.UnmarshalMap(*record, &betBucket)
	if err != nil {
		log.Println("Error unmarshalling extra bets record: " + err.Error())
		return nil
	}

	return &betBucket
}

func (db DynamoDb) AddBetsToExtraQuestionBetBucket(
	squadId *string, tournamentId *string,
	userId *string, bets *models.ExtraQuestionUserBetBucket,
) *models.ExtraQuestionBetBucket {

	betValue := &sdk.AttributeValue{}
	err := bets.MarshalDynamoDBAttributeValue(betValue)
	if err != nil {
		log.Println("Failed to marshal extra bets record: " + err.Error())
		return nil
	}

	newPoolRecord, err := db.updateItem(
		"extra-bets",
		compoundKey(
			"squad_id", squadId,
			"tournament_id", tournamentId,
		),
		set("bets.#userId = :bets").
			withFieldName("#userId", userId).
			bind(":bets", betValue),
	)
	if err != nil {
		log.Println("Failed to update special question bets: " + err.Error())
		return nil
	}

	betBucket := models.ExtraQuestionBetBucket{}
	err = attr.UnmarshalMap(*newPoolRecord, &betBucket)
	if err != nil {
		return nil
	}

	return &betBucket
}
