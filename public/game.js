export default function createGame(){
    const state ={
        players: {},
        monsters:{},
        screen:{
            width:10,
            height:10
        }
    }

    const observers =[]
    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state,newState)
    }

    function addPlayer(command){
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random()*state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random()*state.screen.height)
    
        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type:'add-player',
            playerId:playerId,
            playerX:playerX,
            playerY:playerY
        })
    }

    function removePlayer(command){
        const playerId = command.playerId
        delete state.players[playerId]

        notifyAll({
            type:'remove-player',
            playerId:playerId
        })
    }

    function addMonster(command){
        const monsterId = command.monsterId
        const monsterX = command.monsterX
        const monsterY = command.monsterY

        state.monsters[monsterId] = {
            x: monsterX,
            y: monsterY
        }
    }

    function removeMonster(command){
        const monsterId = command.monsterId
        console.log(`removing monster ${monsterId}`)
        delete state.monsters[monsterId]
    }

    function movePlayer(command){
        notifyAll(command)
        const acceptedMoves = {
            ArrowUp(player){
              if(player.y - 1>= 0)  
                player.y = player.y - 1
            },
            ArrowDown(player){
              if(player.y+1 < state.screen.height)
                player.y = player.y + 1 
            },
            ArrowLeft(player){
                if(player.x - 1 >=0 )
                    player.x = player.x - 1
            },
            ArrowRight(player){
                if(player.x+1 < state.screen.width)  
                    player.x = player.x + 1
            },
        }
        
        const keyPressed = command.keyPressed
        const player = state.players[command.playerId]
        const playerId = command.playerId
        const moveFunction = acceptedMoves[keyPressed]
        
        if(player && moveFunction){
            moveFunction(player)
            checkForCollision(playerId)
        }

        function checkForCollision(playerId){
            const player = state.players[playerId]
            for(const monsterId in state.monsters){
                const monster = state.monsters[monsterId]
                if(player.x === monster.x && player.y === monster.y){
                    console.log(`colisao ${monsterId} `)
                    removeMonster({monsterId: monsterId})
                }
            }
        }

        return 
    }

    return {
        movePlayer, 
        state, 
        addPlayer, 
        removePlayer,
        addMonster,
        removeMonster,
        setState, 
        subscribe
    }
}
