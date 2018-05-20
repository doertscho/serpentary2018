package lib

import (
	"regexp"
	"strings"
)

func MakePathMatcher(path string) func(...string) bool {
	parsedPath := ParsePath(path)
	return func(matchers ...string) bool {
		if len(parsedPath) != len(matchers) {
			return false
		}
		for i, pathElement := range parsedPath {
			matcher := matchers[i]
			if matcher == "_" {
				if !isValidStringId(pathElement) {
					return false
				}
			} else if matcher != pathElement {
				return false
			}
		}
		return true
	}
}

func ParsePath(path string) []string {
	return TrimAndFilterEmpty(strings.Split(path, "/"))
}

func TrimAndFilterEmpty(in []string) (filtered []string) {
	for _, value := range in {
		trimmed := strings.TrimSpace(value)
		if len(trimmed) > 0 {
			filtered = append(filtered, trimmed)
		}
	}
	return
}

func isValidStringId(input string) bool {
	matched, err := regexp.MatchString("^[0-9a-z-]+$", input)
	return err == nil && matched
}
