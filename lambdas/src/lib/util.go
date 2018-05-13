package lib

import (
	"strconv"
	"strings"
)

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
