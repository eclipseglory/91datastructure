export default {
    rotate: {
        left: 'Left',
        right: 'Right'
    },
    title: {
        front: "Red-Black",
        next: "Tree",
        githubdes: "Github"
    },
    operation: {
        insert: 'Insert',
        randomInsert: 'Random Insert',
        delete: 'Delete',
        randomDelete: 'Randon Dekete',
        placeholder: '0-999',
        generate: 'Generate',
        generateholder: '<100'
    },
    main: {
        error1: "The ID should be a number(0-999)",
        error2: "The generate nodes number should be 1-99"
    },

    footer: {
        reportbug: "Report a bug"
    },

    tip: {
        insertNode: 'Inserted node',
        replaceNode: 'Replace node',
        deleteNode: 'Deleting node',
        currentBalance: 'Processing node',
        nextBalance: 'Next',
        case: 'Cases',
        reason: 'Reasons',
        process: 'Operations',
        pause: 'Pause',
        forward: 'Forward',
        none: 'None',
        balanced: 'Balanced',
        notbalanced: 'Unbalanced',
        insertBalanceOp: 'Insertion',
        deleteBalanceOp: 'Removal',
        redKey: 'Red',
        blackKey: 'Black',
        rRotateKey: 'Right Rotate',
        lRotateKey: 'Left Rotate',
    },

    canvas: {
        deleteNode: "Removal",
        insertNode: "Insertion",
    },
    message: {
        insertsuccess: "Node({id}) insertion completed",
        updatewarning: "Node({id}) exsits，just update it",
        deletesuccess: "Node({id}) removal complete",
        deleteerror: "Node({id}) does not exist",
        generatesuccess: "Generate {num} nodes BRTree complete",
        deleteBlance: {
            additional1: '. Remove the Replace Node({0}), and replace the Deleting Node({1})\'s id with its',
            additional2: '. The Deleting Node and Replace Node is the same one, remove the Deleting Node({0}) directly',
            additional3: 'It\'s balanced',
            simple: {
                case1: {
                    ca: 'Simple case(1). Replace Node is Red, and it has only one child node at most',
                    op: 'Do nothing',
                    re: 'Replace Node({0}) is Red, Base on RBTree\'s features, Its parent MUST be Black and its children MUST be Black too, it won\'t break the RBTree balance if deleted it directly.'
                },
                case2: {
                    re: 'Replace Node({0}) has a single Red child node({1}), if remove the Replace Node({0}), the black nodes count which pass cross this Replace Node({0}) will minus 1 , so change the single Red child node({1}) of the Replace Node({0}) to Black, and use it to repalce the Replace Node({0}), the balance won\'t be broken',
                    op: 'Change its Red child node({0})\'s color to Black, and remove the replace node , use the Node({0}) to replace the Replace Node',
                    ca: 'Simple case(1). Replace Node is Black, it has only one child and this child node is Red',
                },
                case3: {
                    re: 'The Replace Node({0}) is Black, If delete it, the black nodes count of the path which cross this node will change.',
                    op: 'Need to balance the RBTree via the Replace Node({0})',
                    ca: 'Simple(3). The Replace Node is Black, and has no Red child',
                }
            },
            complex: {
                case1: {
                    re: 'Need not to balance for the root',
                    ca: 'Case(1). The processing node is the root',
                },
                case2: {
                    re: 'When we do next balance, The Processing Node\'s father is Red, so it will match case(4),case(5),case(6)',
                    op: 'Change father({0}) to Red，Change brother({1}) to Black，and {3} Rotate the father, go on balance via this node(${2})',
                    ca: 'Case(2). The Processing Node\'s brother is Red',
                },
                case3: {
                    re: 'The sub-tree is unable to be balanced whatever we do , so change the processing node\'s brother to Red, it make the black nodes count of the path which cross its father won\'t reduce, then go on balance via its father',
                    op: 'Change the brother({0}) to Red，go on balance via its father({1}) next time',
                    ca: 'Case(3). The Processing Node is Black , its father, brother, nephew are Black(or it has no nephew)',
                },
                case4: {
                    op: 'Change brother({0}) to Red, father({0}) to Black, Balance complete',
                    ca: 'Case(4). The Processing Node is Black, its brother and nephew are Black(or it has no nephew), but its father is Red',
                },
                case5: {
                    re: 'Rotating the Processing Node\'s brother and changing color , we can go to Case(6)',
                    op: 'Change brother({0}) to Red，Change the nephew({1}) which is in the same direction with the Processing Node to Black，then {3} Rotate its brother, go on balance via this node({2})',
                    ca: 'Case(5). The Processing Node is Black, its brother is Black too, One of its nephew is Red, the processing node and this nephew is in same direction(it means , the node and its nephew both are right node or left node)',
                },
                case6: {
                    op: 'Exchange the color of the brother({0}) and father({1})，Change the processing node\'s Red nephew({2}) to Black, {3} Rotate its father({1}). Balance complete',
                    ca: 'Case(6). The Processing Node is Black , its brother is Black too, The nephew\'s color are different with each other(or it has a single Red nephew), the processing node and its Red nephew is not in same direction(it means , it\'s left node but its nephew is right , it\'s right node but its nephew is left)',
                },
            }
        },

        insertBlance: {
            case1: {
                re: 'No need to balance Black node',
            },
            case2: {
                re: 'The root MUST be Black',
                op: 'Change node({0}) to Black',
            },
            case3: {
                ca: 'The Processing Node\'s father is Black，need not to balance',
            },

            case4: {
                op: 'Change grandpa({0}) to Red, Change father({1}),uncle({2}) to Black, go on balance via grandpa({0})',
                ca: 'Case(1). The Processing Node\'s father , uncle are Red',
            },
            case5: {
                re: 'After rotating , next processing node is the father of current processing node, make them to be in same direction, so it can go to Case(2)',
                op: '{1} Rotate father({0})',
                ca: 'Case(3). The Processing Node and its father both are Red and they are not in same direction',
            },
            case6: {
                op: 'Change grandpa({0}) to Red，Change father({1}) to black，{2} Rotate grandpa, Balance complete',
                ca: 'Case(2). The Processing Node\'s father is red, they are in same direction, and the Processing Node has no uncle or its uncle is Black',
            },
        },
    }
}