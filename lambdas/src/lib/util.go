package lib

import (
	"encoding/json"
	"log"
	"reflect"
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

	reflectedType := reflect.TypeOf(claims)
	log.Println("claims appears to have type " + reflectedType.PkgPath() + " -> " + reflectedType.Name())
	log.Println(reflectedType.String())

	claimsMap, convertible := claims.(map[string]interface{})
	if !convertible {
		log.Println("claims could not be converted to map")
		return nil
	}

	userNameRaw, contained := claimsMap["cognito:username"]
	if !contained {
		log.Println("claims did not contain entry cognito:username")
		return nil
	}

	userName, convertible := userNameRaw.(string)
	if !convertible {
		log.Println("user name could not be converted to string")
		return nil
	}

	if len(userName) == 0 {
		log.Println("user name was blank")
		return nil
	}

	log.Println("extracted user name " + userName)
	var userId int32 = 1
	return &userId
}
