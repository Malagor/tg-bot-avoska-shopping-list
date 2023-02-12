export async function createListCommand(ctx) {
	try {
		await ctx.scene.enter('createListScene');
	} catch (e) {
		console.error('ERROR! Can not enter renameListScene\n', e);
	}
}
