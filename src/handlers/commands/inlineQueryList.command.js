import { shoppingListService } from '../../database/shopping-list.service.js';
import { getUserId } from '../../helpers/context.helper.js';
import { getInlineQueryAnswer } from '../../helpers/shopping-list.helper.js';

export async function inlineQueryListCommand(ctx) {
	const userId = getUserId(ctx);

	const lists = await shoppingListService.getAllShoppingListsByUserId(userId);
	if (!lists) {
		await sendNoResultMessage(ctx);
	} else {
		const answerArray = getInlineQueryAnswer(lists);
		ctx.answerInlineQuery(answerArray, {
			cache_time: 0,
		});
	}
}

function sendNoResultMessage(ctx) {
	ctx.answerInlineQuery([
		{
			id: 1,
			type: 'article',
			title: 'Нет списков для данного пользователя',
			input_message_content: {
				message_text: '',
			},
		},
	]);
}
