import { DiscountBadgeSolid, GroupSolid, OverdueSolid } from '../../../../../assets/icons';

export const getIcon = (key) => {
    switch (key) {
        case 'alunos':
            return GroupSolid
        case 'pagDesconto':
            return DiscountBadgeSolid
        case 'pagAtrasados':
            return OverdueSolid
    }
}