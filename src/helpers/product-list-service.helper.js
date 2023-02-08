/**
 *
 * @param {number} userId
 * @return {{userIds: {$all: [string]}}}
 */
export function createQueryForProductLists(userId) {
	return {
		userIds: {
			$all: [`${userId}`],
		},
	};
}
