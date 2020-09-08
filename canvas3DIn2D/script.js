const canvas = document.querySelector('#scene')

// Pega as dimesões do canvas
let width = canvas.offsetWidth
let height = canvas.offsetHeight

const ctx = canvas.getContext('2d')

// Função chamada quando muda as dimensões da pagina
function onResize() {
  width = canvas.offsetWidth
  height = canvas.offsetHeight

  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    ctx.scale(2, 2)
  } else {
    canvas.width = width
    canvas.height = height
  }
}

// Ouve o evento de resize
window.addEventListener('rezize', onResize)
onResize()

let PERSPECTIVE = width * 0.8 // O Campo de visão da cena 3D
let PROJECTION_CENTER_X = width / 2
let PROJECTION_CENTER_Y = height / 2

const dots = [] // Guarda toda particula nesse array

const DOT_RADIUS = 10
let GLOBE_RADIUS = width / 3

class Dot {
  constructor() {
    this.theta = Math.random() * 2 * Math.PI
    this.phi = Math.acos((Math.random() * 2) - 1)

    this.x = 0
    this.y = 0
    this.z = 0
    // this.radius = 10 // Tamanho do elemento no 3D

    this.xProjected = 0
    this.yProjected = 0
    this.scaleProjected = 0



    TweenMax.to(this, 20 + Math.random() * 10, {
      theta: this.theta + Math.PI * 2,
      repeat: -1,
      ease: Power0.easeNone
    })
  }

  project() {
    this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta)
    this.y = GLOBE_RADIUS * Math.cos(this.phi)
    this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS

    // Project the 3D coordinates to the 2D canvas
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z)
    this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X
    this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y
  }

  draw() {
    // Primeiro calcula o valores do ponto
    this.project()
    // We define the opacity of our element based on its distance
    ctx.globalAlpha = Math.abs(1 - this.z / width)

    ctx.beginPath()
    // We draw a rectangle based on the projected coordinates and scale
    ctx.arc(this.xProjected, this.yProjected, DOT_RADIUS * this.scaleProjected, 0, Math.PI * 2)

    ctx.fill()
  }
}


// Create 800 new dots
for (let i = 0; i < 800; i++) {
  // Create a new dots and push it into the array
  dots.push(new Dot())
}

render()

function render() {
  // Clear the scene
  ctx.clearRect(0, 0, width, height)

  for (var i = 0; i < dots.length; i++) {
    dots[i].draw()
  }

  window.requestAnimationFrame(render)
}
