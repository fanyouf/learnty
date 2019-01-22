const L_Shape = [
    [
        [1,0],
        [1,0],
        [1,1]
    ],
    [
        [1,1,1],
        [1,0,0],
    ],
    [
        [1,1],
        [0,1],
        [0,1]
    ],
    [
        [0,0,1],
        [1,1,1],
    ]
]

const O_Shape = [
    [
        [1,1],
        [1,1]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const N_Shape = [
    [
        [1,0],
        [1,1],
        [0,1]
    ],
    [
        [0,1,1],
        [1,1,0],
    ]
]

const Z_Shape = [
    [
        [0,1],
        [1,1],
        [1,0]
    ],
    [
        [1,1,0],
        [0,1,1],
    ]
]

const line_Shape = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
    ],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0]
    ]
]

const Crose_Shape = [
    [
        [1,0],
        [1,1],
        [1,0],
    ],
    [
        [1,1,1],
        [0,1,0],
    ],
    [
        [0,1],
        [1,1],
        [0,1],
    ],
    [
        [0,1,0],
        [1,1,1],
    ],
]

// const Fan_Shape = [
//     [
//         [1,0,1],
//         [1,1,1],
//         [1,0,1],
//     ],
//     [
//         [1,1,1],
//         [0,1,0],
//         [1,1,1],
//     ]
// ]


const BLOCK_SHAPE_ARR = [ L_Shape, N_Shape, O_Shape,Z_Shape,line_Shape,Crose_Shape ].map(shape=>shape.map(item=>{
    let ar = [];
    item.forEach((it,y)=>{
        it.forEach((val,x)=>{
            if(val){
                ar.push({x,y})
            }
        })
    })
    return ar;
}));


const getBlockShape = function(){
    let len = BLOCK_SHAPE_ARR.length;
    return BLOCK_SHAPE_ARR[Math.floor(Math.random() * len)]
}

export { BLOCK_SHAPE_ARR ,getBlockShape} 