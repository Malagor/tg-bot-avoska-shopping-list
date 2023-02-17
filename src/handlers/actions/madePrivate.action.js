export async function madePrivateAction(ctx) {
	try {
		await ctx.scene.enter('madePrivateScene');
	} catch (e) {
		console.error('ERROR! Can not enter deleteListScene\n', e);
	}
}
