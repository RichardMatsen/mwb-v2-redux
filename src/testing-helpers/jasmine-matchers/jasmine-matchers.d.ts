declare module jasmine {
	interface Matchers<T> {
		toHaveProperties(expected: any): boolean;
	}
	interface Matchers<T> {
		toDeepEqual(expected: any): boolean;
	}
	interface Matchers<T> {
		toStartWith(expected: any): boolean;
	}
}
