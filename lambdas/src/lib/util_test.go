package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTrimAndFilterEmptyDoesFilterOutWhiteSpaceElements(t *testing.T) {
	input := []string{"a", "", "b", " ", "c", "   "}
	expected := []string{"a", "b", "c"}
	actual := TrimAndFilterEmpty(input)
	assert.Equal(t, expected, actual)
}

func TestTrimAndFilterEmptyDoesTrimValues(t *testing.T) {
	input := []string{"  a", "b   ", "  c  ", "   "}
	expected := []string{"a", "b", "c"}
	actual := TrimAndFilterEmpty(input)
	assert.Equal(t, expected, actual)
}
