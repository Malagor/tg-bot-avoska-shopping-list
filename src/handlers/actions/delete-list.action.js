export async function deleteListAction(ctx) {
	try {
		await ctx.scene.enter('deleteListScene');
	} catch (e) {
		console.error('ERROR! Can not enter deleteListScene\n', e);
	}
}
