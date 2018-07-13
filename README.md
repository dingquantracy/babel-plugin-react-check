# babel-plugin-react-check

目前检测的内容有：

1.  禁止使用 class properties 的方式定义方法

2.  禁止在 'constructor', 'componentWillMount', 'componentDidUpdate' 三个方法中使用 this.setState

3.  禁止在 'constructor', 'componentWillMount' 中使用 'document', 'window', 'location' 等全局变量，防止 SSR 时报错

4.  如果一个组件中进行了 addEventListener()， 一定要进行 removeEventListener()
