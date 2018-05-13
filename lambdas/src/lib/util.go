package lib

import (
	"encoding/json"
	"log"
	"strconv"
	"strings"

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

func ParsePath(path string) []string {
	return TrimAndFilterEmpty(strings.Split(path, "/"))
}

func TrimAndFilterEmpty(in []string) (filtered []string) {
	for i := range in {
		trimmed := strings.TrimSpace(in[i])
		if len(trimmed) > 0 {
			filtered = append(filtered, trimmed)
		}
	}
	return
}

func MatchPrefix(pathElements []string, prefix string) (
	doesMatch bool, rest []string) {

	if len(pathElements) > 0 && pathElements[0] == prefix {
		return true, pathElements[1:]
	}
	return false, nil
}

func MatchInt(pathElements []string) (parsed *int, rest []string) {
	if len(pathElements) == 0 {
		return nil, nil
	}
	parsedInt64, err := strconv.ParseInt(pathElements[0], 10, 32)
	if err != nil {
		return nil, nil
	}
	parsedInt := int(parsedInt64)
	return &parsedInt, pathElements[1:]
}

func GetUserId(request events.APIGatewayProxyRequest) *int32 {

	claims, contained := request.RequestContext.Authorizer["claims"]
	if !contained {
		log.Println("Authorizer field did not contain claims")
		return nil
	}

	claimsMapPointer, convertible := claims.(*map[string]string)
	if !convertible {
		log.Println("claims could not be converted to map pointer")
		return nil
	}

	if claimsMapPointer == nil {
		log.Println("claims pointer was nil")
		return nil
	}

	claimsMap := *claimsMapPointer
	userName, contained := claimsMap["cognito:username"]
	if !contained {
		log.Println("claims did not contain cognito username")
		return nil
	}

	if len(userName) == 0 {
		log.Println("username was blank")
		return nil
	}

	var userId int32 = 1
	return &userId
}
