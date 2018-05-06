package lib

import (
	"main/models"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNotFoundHasCode404(t *testing.T) {
	actual := NotFound()
	assert.Equal(t, 404, actual.StatusCode)
}

func TestBadRequestHasCode400(t *testing.T) {
	message := "I don't get it."
	actual := BadRequest(message)
	assert.Equal(t, 400, actual.StatusCode)
	assert.Equal(t, message, actual.Body)
}

func TestBuildResponseHasCode200(t *testing.T) {
	data := &models.Update{}
	actual := BuildResponse(data)
	assert.Equal(t, 200, actual.StatusCode)
}
