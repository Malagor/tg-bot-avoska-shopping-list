export async function renameListAction(ctx) {
	try {
		await ctx.scene.enter('renameListScene');
	} catch (e) {
		console.error('ERROR! Can not enter renameListScene\n', e);
	}
}
