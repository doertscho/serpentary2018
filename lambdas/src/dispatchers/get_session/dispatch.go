package get_session

import (
	"encoding/json"
	"log"
	"main/conf"
	"main/lib"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(dispatch)
}

func dispatch(request events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	requestDebug, err := json.Marshal(request)
	if err != nil {
		log.Println("received request: " + string(requestDebug))
	}

	if request.HTTPMethod == "OPTIONS" {
		return lib.Options(), nil
	}

	path := parsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "my"); doesMatch {

		if doesMatch, rest := lib.MatchPrefix(rest, "id"); doesMatch {

			if len(rest) == 0 {

				identityDebug, err := json.Marshal(request.RequestContext.Identity)

				if err != nil {

					return events.APIGatewayProxyResponse{

						StatusCode: 200,
						Body:       string(identityDebug),

						Headers: map[string]string{
							"Content-Type":                "application/json",
							"Access-Control-Allow-Origin": conf.AllowOrigin,
						},
					}, nil
				} else {

					return events.APIGatewayProxyResponse{

						StatusCode: 500,
						Body:       err.Error(),

						Headers: map[string]string{
							"Content-Type":                "text/plain",
							"Access-Control-Allow-Origin": conf.AllowOrigin,
						},
					}, nil
				}
			}
		}
	}

	return lib.NotFound(), nil
}

func parsePath(path string) []string {
	return lib.TrimAndFilterEmpty(strings.Split(path, "/"))
}
