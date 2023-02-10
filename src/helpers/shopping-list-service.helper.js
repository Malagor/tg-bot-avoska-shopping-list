/**
 *
 * @param {number} userId
 * @return {{userIds: {$all: [string]}}}
 */
export function createQueryForShoppingLists(userId) {
	return {
		userIds: {
			$all: [`${userId}`],
		},
	};
}
