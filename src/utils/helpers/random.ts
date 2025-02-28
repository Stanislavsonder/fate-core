export function randomSign(): number {
	return Math.random() < 0.5 ? -1 : 1
}

export function randomRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomArrayValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]
}
