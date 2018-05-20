package lib

import (
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

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

	if len(userId) == 0 {
		log.Println("user id was blank")
		return nil
	}

	return &userId
}
