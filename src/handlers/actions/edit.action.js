export async function editAction(ctx) {
	try {
		await ctx.scene.enter('editProductScene');
	} catch (e) {
		console.error('ERROR! Can not enter editProductScene\n', e);
	}
}
