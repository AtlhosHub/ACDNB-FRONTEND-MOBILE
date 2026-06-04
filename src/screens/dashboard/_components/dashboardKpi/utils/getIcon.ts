import { DiscountBadgeSolid, ExitSolid, GroupSolid, OverdueSolid } from '../../../../../assets/icons';

export const getIcon = (key: string) => {
    switch (key) {
        case 'alunos':
            return GroupSolid
        case 'pagDesconto':
            return DiscountBadgeSolid
        case 'pagAtrasados':
            return OverdueSolid
        case 'exit':
            return ExitSolid
    }
}