import { Character, CharacterAspectType } from '@/types'
import { BASE_CHARACTER } from '@/constants'
import lizardPlaceholder from './assets/Lizard.jpg'

const MOCK_CHARACTERS: Record<string, Character> = {
	ru: {
		...BASE_CHARACTER,
		name: 'Станислав Ящер-Воин',
		race: 'Ящеролюд',
		description: 'Свирепый воин из пустыни, Ящер-Воин мастер скрытности и боя. Он известен своими быстрыми рефлексами и острыми когтями.',
		image: lizardPlaceholder,
		aspects: [
			{
				name: 'Ящер-Воин из Пустыни, тот, кто наносит удары из тени',
				description: 'Свирепый воин из пустыни, Ящер-Воин мастер скрытности и боя. Он известен своими быстрыми рефлексами и острыми когтями.',
				type: CharacterAspectType.HighConcept
			},
			{
				name: 'Проблемы в Тени',
				description:
					'Ящер-Воин преследуется своим прошлым и тенями, которые следуют за ним. Он всегда оглядывается через плечо, ожидая, что опасность ударит в любой момент.',
				type: CharacterAspectType.Trouble
			},
			{
				name: 'Огонь и Лёд',
				description:
					'Ящер-Воин - существо крайностей, с огненным темпераментом и холодным сердцем. Он известен своей непредсказуемой натурой и способностью адаптироваться к любой ситуации.',
				type: CharacterAspectType.Other
			},
			{
				name: 'Пустынный Ветер',
				description:
					'Ящер-Воин мастер скорости и ловкости, способный двигаться с невероятной грацией и точностью. Он известен своей способностью уклоняться от атак и наносить смертельные удары.',
				type: CharacterAspectType.Consequence
			}
		],
		stunts: [
			{
				name: 'Пустынный Ветер',
				description:
					'Ящер-Воин может двигаться с невероятной скоростью, уклоняясь от атак и нанося точные удары. Он получает +2 ко всем броскам, связанным со скоростью и ловкостью.',
				priceInTokens: 3,
				skill: 'athletics'
			},
			{
				name: 'Шаг в Тень',
				description:
					'Ящер-Воин может исчезнуть в тенях и появиться в другом месте. Он получает +2 ко всем броскам, связанным со скрытностью и внезапными атаками.',
				priceInTokens: 0,
				skill: 'stealth'
			},
			{
				name: 'Огонь и Лёд',
				description:
					'Ящер-Воин может направить свой внутренний огонь и лёд, чтобы нанести мощные удары. Он получает +2 ко всем броскам, связанным с боем и запугиванием.',
				priceInTokens: 1,
				skill: 'fight'
			}
		]
	},
	en: {
		...BASE_CHARACTER,
		name: 'Stanislav Lizard-Warrior',
		race: 'Lizardfolk',
		description: 'A fierce warrior from the desert, Lizard-Warrior is a master of stealth and combat. He is known for his quick reflexes and sharp claws.',
		image: lizardPlaceholder,
		aspects: [
			{
				name: 'Lizard-Warrior from the Desert, the one who strikes from the shadows',
				description: 'A fierce warrior from the desert, Lizard-Warrior is a master of stealth and combat. He is known for his quick reflexes and sharp claws.',
				type: CharacterAspectType.HighConcept
			},
			{
				name: 'Problems in the Shadows',
				description:
					'Lizard-Warrior is haunted by his past and the shadows that follow him. He always looks over his shoulder, expecting danger to strike at any moment.',
				type: CharacterAspectType.Trouble
			},
			{
				name: 'Fire and Ice',
				description:
					'Lizard-Warrior is a creature of extremes, with a fiery temperament and a cold heart. He is known for his unpredictable nature and ability to adapt to any situation.',
				type: CharacterAspectType.Other
			},
			{
				name: 'Desert Wind',
				description:
					'Lizard-Warrior is a master of speed and agility, able to move with incredible grace and precision. He is known for his ability to dodge attacks and deliver deadly strikes.',
				type: CharacterAspectType.Consequence
			}
		],
		stunts: [
			{
				name: 'Desert Wind',
				description:
					'Lizard-Warrior can move with incredible speed, dodging attacks and delivering precise strikes. He gets +2 to all rolls related to speed and agility.',
				priceInTokens: 3,
				skill: 'athletics'
			},
			{
				name: 'Step into the Shadow',
				description: 'Lizard-Warrior can disappear into the shadows and reappear elsewhere. He gets +2 to all rolls related to stealth and surprise attacks.',
				priceInTokens: 0,
				skill: 'stealth'
			},
			{
				name: 'Fire and Ice',
				description:
					'Lizard-Warrior can channel his inner fire and ice to deliver powerful strikes. He gets +2 to all rolls related to combat and intimidation.',
				priceInTokens: 1,
				skill: 'fight'
			}
		]
	}
}

for (const locale in MOCK_CHARACTERS) {
	const character = MOCK_CHARACTERS[locale]
	for (const skill of Object.keys(character.skills)) {
		character.skills[skill] = Math.floor(Math.random() * 5)
	}
}

export { MOCK_CHARACTERS }

export function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value))
}
