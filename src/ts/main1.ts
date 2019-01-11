import  { sparkT, fireworkT} from "./interface"

const FIREWORKS_MAX_NUMBER :number = 10,
        SPARKPERFIREWORKS:number = 50;

let canvas:HTMLCanvasElement = document.getElementById('myCanvas');
let context = canvas.getContext('2d');



let fireworks:Array<fireworkT> = [];

for (let i = 0; i < FIREWORKS_MAX_NUMBER; i++) {
    let firework : fireworkT= {
        x:0,
        y:0,
        age:0,
        phase:'',
        sparks: []
    }

    for (let n = 0; n < SPARKPERFIREWORKS; n++) {
        let spark:sparkT = {
        vx: Math.random() * 5 + 0.5,
        vy: Math.random() * 5 + 0.5,
        weight: Math.random() * 0.3 + 0.03,
        red: Math.floor(Math.random() * 2),
        green: Math.floor(Math.random() * 2),
        blue: Math.floor(Math.random() * 2)
        }

        if (Math.random() > 0.5) spark.vx = -spark.vx

        if (Math.random() > 0.5) spark.vy = -spark.vy

        firework.sparks.push(spark)
    }

    fireworks.push(firework)

    resetFirework(firework)
}

 window.requestAnimationFrame(explode)

      function resetFirework(firework:fireworkT) {
        firework.x = Math.floor(Math.random() * canvas.width)

        firework.y = canvas.height

        firework.age = 0

        firework.phase = 'fly'
      }

      function explode() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        fireworks.forEach((firework:fireworkT, index:number) => {
          if (firework.phase == 'explode') {
            firework.sparks.forEach(spark => {
              for (let i = 0; i < 10; i++) {
                let trailAge = firework.age + i

                let x = firework.x + spark.vx * trailAge

                let y = firework.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge

                let fade = i * 20 - firework.age * 2

                let r = Math.floor(spark.red * fade)

                let g = Math.floor(spark.green * fade)

                let b = Math.floor(spark.blue * fade)

                context.beginPath()

                context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',1)'

                context.rect(x, y, 4, 4)

                context.fill()
              }
            })

            firework.age++

            if (firework.age > 100 && Math.random() < 0.05) {
              resetFirework(firework)
            }
          } else {
            firework.y = firework.y - 10
            for (let i = 0; i < 15; i++) {
              context.beginPath()

              context.fillStyle = 'rgba(' + index * 50 + ',' + i * 17 + ',0,1)'

              context.rect(firework.x + Math.random() * i - i / 2, firework.y + i * 4, 4, 4)

              context.fill()
            }

            if (Math.random() < 0.001 || firework.y < 200) firework.phase = 'explode'
          }
        })

        window.requestAnimationFrame(explode)
      }