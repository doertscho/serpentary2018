package db

import "main/models"

func InitDatabase() {
	InitDynamoDB()
}

func GetDb() Db {
	return GetDynamoDb()
}

type Db interface {
	GetTournaments() []*models.Tournament
	FindTournamentById(id int) *models.Tournament
}
