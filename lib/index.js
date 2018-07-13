module.exports = function(babel) {
  try {
    var t = babel.types // AST模块
    return {
      visitor: {
        Class(path, state) {
          let node = path.node
          let eventListenersCount = 0
          let className = node.id.name
          // console.log(node)
          path.traverse({
            ClassProperty(path) {
              let node = path.node
              if (
                t.isArrowFunctionExpression(node.value) ||
                t.isFunctionExpression(node.value)
              ) {
                throw path.buildCodeFrameError(
                  'Dont use class properties to define a function'
                )
              }
            },

            ClassMethod(path, state) {
              let node = path.node
              let method = node.key.name

              path.traverse({
                MemberExpression(path) {
                  let node = path.node

                  // console.log(node)

                  if (
                    node.object.type === 'Identifier' &&
                    ['constructor', 'componentWillMount'].includes(method) &&
                    ['document', 'window', 'location'].includes(
                      node.object.name
                    )
                  ) {
                    throw path.buildCodeFrameError(
                      `Don't use browser global object in ${method}`
                    )
                  }

                  if (
                    node.property.name === 'setState' &&
                    node.object.type === 'ThisExpression' &&
                    [
                      'constructor',
                      'componentWillMount',
                      'componentDidUpdate'
                    ].includes(method)
                  ) {
                    throw path.buildCodeFrameError(
                      `Don't use 'this.setState' in '${method}', instead, you can use 'this.state' in constructor `
                    )
                  }

                  if (node.property.name === 'addEventListener') {
                    eventListenersCount++
                  }
                  if (node.property.name == 'removeEventListener') {
                    eventListenersCount--
                  }
                }
              })
            }
          })

          if (eventListenersCount > 0) {
            throw path.buildCodeFrameError(
              `It seems you forgot to removeEventListeners in class: ${className} `
            )
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
    process.exit()
  }
}
