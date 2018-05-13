package lib

import (
	"main/models"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestOptionsHasCode200(t *testing.T) {
	actual := Options()
	assert.Equal(t, 200, actual.StatusCode)
}

func TestBadRequestHasCode400(t *testing.T) {
	message := "I don't get it."
	actual := BadRequest(message)
	assert.Equal(t, 400, actual.StatusCode)
	assert.Equal(t, message, actual.Body)
}

func TestUnauthorizedHasCode401(t *testing.T) {
	actual := Unauthorized()
	assert.Equal(t, 401, actual.StatusCode)
}

func TestNotFoundHasCode404(t *testing.T) {
	actual := NotFound()
	assert.Equal(t, 404, actual.StatusCode)
}

func TestInternalErrorHasCode500(t *testing.T) {
	actual := InternalError()
	assert.Equal(t, 500, actual.StatusCode)
}

func TestBuildUpdateHasCode200(t *testing.T) {
	data := &models.Update{}
	actual := BuildUpdate(data)
	assert.Equal(t, 200, actual.StatusCode)
}

func TestBuildSessionHasCode200(t *testing.T) {
	data := &models.Session{}
	actual := BuildSession(data)
	assert.Equal(t, 200, actual.StatusCode)
}
