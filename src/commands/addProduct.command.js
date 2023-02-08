export async function addProductCommand(ctx) {
	try {
		await ctx.scene.enter('addProductScene');
	} catch (e) {
		console.error('ERROR! Can not enter addProductScene\n', e);
	}
}
