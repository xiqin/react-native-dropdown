# react-native-dropdown

## Demo
![](https://raw.githubusercontent.com/txqsimon/react-native-Dropdown/master/demo/simple.gif)
![](https://raw.githubusercontent.com/txqsimon/react-native-Dropdown/master/demo/multiple.gif)

## Getting started


`$ npm install react-native-dropdown-component --save`


### Mostly automatic installation


`$ react-native link react-native-dropdown-component`


### Manual installation




#### iOS


1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-dropdown-component` and add `RNDropdown.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNDropdown.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<


#### Android


1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNDropdownPackage;` to the imports at the top of the file
  - Add `new RNDropdownPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
      ```
      include ':react-native-dropdown-component'
      project(':react-native-dropdown-component').projectDir = new File(rootProject.projectDir,     '../node_modules/react-native-dropdown-component/android')
      ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
      ```
   compile project(':react-native-dropdown-component')
      ```


#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)


1. In Visual Studio add the `RNDropdown.sln` in `node_modules/react-native-dropdown/windows/RNDropdown.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Dropdown.RNDropdown;` to the usings at the top of the file
  - Add `new RNDropdownPackage()` to the `List<IReactPackage>` returned by the `Packages` method




## Usage
```javascript
import RNDropdown from 'react-native-dropdown-component';

const Menus = [
  {
    key: '1',
    name: '订单类型',
    activeItems: ['all'],
    items: [
      { key: 'all', name: '全部' },
      { key: 'server', name: '服务下单' },
    ],
  },
  {
    key: '2',
    name: '订单状态',
    activeItems: ['hignest'],
    items: [
      { key: 'newest', name: '最新发布' },
      { key: 'hignest', name: '最高预算' },
    ],
  },
];

<RNDropdown
  menus={Menus}
  onSelected={(result) => {console.log(result)}}
  multiple
/>
```

## Props

| Prop  | Type  | Required  | Default  | Description  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| menus  | array  | Yes  |   | Array with header menus and drop-down list  |
| onSelected | func  |  Yes | (result: []) => {}  | Each choose, will return to the selected item  |
| multiple | boolean  |  No | false  | Use multiple selection  |
| okText  | string or JSX.Element  |  No | OK  |  Only show when mutiple is true |
| cancelText  | string or JSX.Element  | No  | Cancel  | Only show when mutiple is true  |
| okTextStyle  | object  | No  |   | css style of okText |
| cancelTextStyle  | object  | No  |   | css style of cancelText  |
