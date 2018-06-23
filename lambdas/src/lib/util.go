package lib

import (
	"encoding/json"
	"log"
	"main/conf"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	cip "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

func Timestamp() uint32 {
	return uint32(time.Now().Unix())
}

func LogRequest(request events.APIGatewayProxyRequest) {
	requestDebug, err := json.Marshal(request)
	if err != nil {
		log.Println("failed to serialise request data: " + err.Error())
		return
	}
	log.Println("received request: " + string(requestDebug))
}

func SliceContains(haystack []string, needle string) bool {
	for _, val := range haystack {
		if val == needle {
			return true
		}
	}
	return false
}

func GetUserId(request events.APIGatewayProxyRequest) *string {

	claims, contained := request.RequestContext.Authorizer["claims"]
	if !contained {
		log.Println("Authorizer field did not contain claims")
		return nil
	}

	claimsMap, convertible := claims.(map[string]interface{})
	if !convertible {
		log.Println("claims could not be converted to map pointer")
		return nil
	}

	userIdRaw, contained := claimsMap["cognito:username"]
	if !contained {
		log.Println("claims did not contain entry cognito:username")
		return nil
	}

	userId, convertible := userIdRaw.(string)
	if !convertible {
		log.Println("user name could not be converted to string")
		return nil
	}

	if !isValidStringId(userId) {
		log.Println("user id has invalid characters")
		return nil
	}

	return &userId
}

func IsAdminUser(userId *string) bool {
	if userId == nil {
		return false
	}

	session := GetAwsSession()
	if session == nil {
		return false
	}
	cognito := cip.New(session)
	poolId := conf.UserPoolId
	listGroupsInput := &cip.AdminListGroupsForUserInput{
		UserPoolId: &poolId,
		Username:   userId,
	}

	result, err := cognito.AdminListGroupsForUser(listGroupsInput)
	if err != nil {
		log.Println("Failed to retrieve user groups: " + err.Error())
		return false
	}

	for _, group := range result.Groups {
		if group.GroupName == nil {
			continue
		}
		groupName := *group.GroupName
		log.Println("User is member of group " + groupName)
		if groupName == "admins" {
			return true
		}
	}
	return false
}

func GetAwsSession() *session.Session {
	awsSession, err := session.NewSession(
		&aws.Config{
			Region: aws.String("eu-central-1"),
		},
	)
	if err != nil {
		log.Println("Failed to create session: " + err.Error())
		return nil
	}
	return awsSession
}
