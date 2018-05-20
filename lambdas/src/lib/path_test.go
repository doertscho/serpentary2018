package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPathMatcherPassesForValidConstants(t *testing.T) {
	path := "/tlr/latest"
	matcher := MakePathMatcher(path)
	expected := true
	actual := matcher("tlr", "latest")
	assert.Equal(t, expected, actual)
}

func TestPathMatcherPassesForValidStringId(t *testing.T) {
	path := "tlr/res-1/sr/sub-res-4"
	matcher := MakePathMatcher(path)
	expected := true
	actual := matcher("tlr", "_", "sr", "_")
	assert.Equal(t, expected, actual)
}

func TestPathMatcherFailsForDifferentLengths(t *testing.T) {
	path := "tlr/res-1"
	matcher := MakePathMatcher(path)
	expected := false
	actual := matcher("tlr", "_", "sr", "_")
	assert.Equal(t, expected, actual)
}

func TestPathMatcherFailsForDifferingConstants(t *testing.T) {
	path := "tlr/latest"
	matcher := MakePathMatcher(path)
	expected := false
	actual := matcher("tlr-2", "latest")
	assert.Equal(t, expected, actual)
}

func TestPathMatcherFailsForInvalidStringId(t *testing.T) {
	path := "tlr/res-1/sr/wEiRd_Invalid_SHIT"
	matcher := MakePathMatcher(path)
	expected := false
	actual := matcher("tlr", "_", "sr", "_")
	assert.Equal(t, expected, actual)
}

func TestParsePathSplitsPathCorrectly(t *testing.T) {
	input := "/a/path/with/elements/"
	expected := []string{"a", "path", "with", "elements"}
	actual := ParsePath(input)
	assert.Equal(t, expected, actual)
}

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
