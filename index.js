import React, { PureComponent } from 'react';
import { NativeModules, Dimensions, PixelRatio, Animated, View, Text, TouchableOpacity, ART, ScrollView, StyleSheet } from 'react-native';

const { RNDropdown } = NativeModules;

const transPxToDp = (elementPx) => {
  const { width } = Dimensions.get('window');
  const UIWidth = 750;
  return PixelRatio.roundToNearestPixel(elementPx * width / UIWidth);
}
const { Surface, Group, Shape } = ART;
const MODAL_HEIGHT = transPxToDp(400);

class Dropdown extends PureComponent {
  state = {
    menus: [],
    curMenu: {
      key: '',
      name: '',
      activeItems: [],
      items: [],
    },
    showModal: false,
    listItemHeight: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    const { menus, multiple } = this.props;
    let data = menus;
    if (!multiple) {
      data = menus.map((menu) => {
        menu.items.forEach((item) => {
          if (menu.activeItems.indexOf(item.key) > -1) {
            menu.label = item.name;
          }
        })
        return menu;
      });
    }
    this.setState({
      menus: data,
    });
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  // change menu
  triggerMenu = (key) => {
    const { showModal, menus, curMenu } = this.state;
    const noChange = curMenu.key === key;
    // if (noChange) {
    //   this.setState({
    //     showModal: !showModal,
    //   });
    //   return;
    // }

    let curMenuInfo = curMenu;
    if (showModal === false || !noChange) {
      // show
      menus.forEach((item) => {
        if (item.key == key) {
          curMenuInfo = JSON.parse(JSON.stringify(item));
        }
      });
    }

    this.setState({
      curMenu: curMenuInfo,
      showModal: !noChange ? true : !showModal,
    }, () => {
      if (this.state.showModal) {
        this.modalAnimated(MODAL_HEIGHT);
      } else {
        this.modalAnimated(0);
      }
    });
  }

  // select or cancel item
  triggerItem = (key, name) => {
    const { multiple } = this.props;
    const { curMenu } = this.state;
    const index = curMenu.activeItems.indexOf(key);
    if (index > -1) {
      // cancel
      curMenu.activeItems.splice(index, 1);
    } else {
      if (!multiple) {
        curMenu.activeItems.splice(0);
      }
      // push
      curMenu.activeItems.push(key);
    }

    this.setState({
      curMenu,
    }, () => {
      !multiple && this.handleCallback(name);
    });
  }

  // cancal
  handleCancel = () => {
    this.setState({
      showModal: false,
    }, () => {
      this.modalAnimated(0);
    });
  }

  // callback items which had selected
  handleCallback = (name) => {
    const { onSelected, multiple } = this.props;
    const { menus, curMenu } = this.state;
    // update origin menus
    const newMenus = menus.map((item) => {
      if (item.key === curMenu.key) {
        item.activeItems = curMenu.activeItems;
        !multiple && (item.label = name);
      }
      return item;
    });
    this.setState({
      menus: newMenus,
      showModal: false,
    }, () => {
      onSelected(this.state.curMenu.activeItems);
    })
  }

  modalAnimated = (toValue) => {
    Animated.timing(
      this.state.listItemHeight,
      {
        toValue,
        duration: 300,
      }
    ).start();
  }

  // whether a item has been selected
  itemSelected = (key) => {
    const { curMenu } = this.state;
    const { activeItems } = curMenu;
    return activeItems.indexOf(key) > -1;
  }

  render() {
    const { okText, cancelText, multiple } = this.props;
    const { menus, curMenu, showModal, listItemHeight } = this.state;
    const { items } = curMenu;
    const selectedFillColor = 'rgb(66,224,203)';

    return (
      <View>
        <View style={styles.menusView}>
          {
            menus.map((item) => {
              return <TouchableOpacity
                key={item.key}
                activeOpacity={0.9}
                onPress={() => this.triggerMenu(item.key)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text
                  style={[styles.menusText, (curMenu.key === item.key && showModal) ? styles.textSelected : null]}
                >
                  {item.label || item.name}
                </Text>
                <Surface
                  width={transPxToDp(28)}
                  height={transPxToDp(28)}
                >
                  <Group scale={0.015}>
                    <Shape
                      fill={(curMenu.key === item.key && showModal) ? selectedFillColor : "rgb(104,104,104)"}
                      d="M163.446154 275.692308h697.107692c19.692308 0 33.476923 25.6 17.723077 43.323077L537.6 736.492308c-11.815385 15.753846-37.415385 15.753846-49.230769 0L143.753846 319.015385c-13.784615-17.723077-1.969231-43.323077 19.692308-43.323077z"
                    />
                  </Group>
                </Surface>
              </TouchableOpacity>
            })
          }
        </View>

        {
          showModal ? (
            <View style={[styles.listView]}>
            <Animated.View
              style={[{
                height: listItemHeight,
              }]}
            >
              <ScrollView style={{ height: MODAL_HEIGHT - transPxToDp(100) }}>
                {
                  items.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.9}
                        style={[styles.listItem, index === items.length - 1 ? { borderBottomWidth: 0 } : null]}
                        onPress={() => this.triggerItem(item.key, item.name)}
                      >
                        <Text
                          style={[styles.listName, this.itemSelected(item.key) ? styles.textSelected : null]}
                        >
                          {item.name}
                        </Text>
                        {
                          this.itemSelected(item.key) ?
                            <Surface
                              width={transPxToDp(36)}
                              height={transPxToDp(28)}
                            >
                              <Group scale={0.02}>
                                <Shape
                                  fill="rgb(66,224,203)"
                                  d="M427.2128 661.1456l364.2368-380.5184a38.4 38.4 0 0 1 55.5008 53.1456l-392.0896 409.6a38.4 38.4 0 0 1-55.6032-0.1536l-222.3104-233.984a38.4 38.4 0 1 1 55.7056-52.9408l194.56 204.8512z"
                                />
                              </Group>
                            </Surface> : null
                        }
                      </TouchableOpacity>
                    );
                  })
                }
              </ScrollView>
              {
                  multiple ? (
                    <View style={styles.operateView}>
                      <TouchableOpacity
                        activeOpacity={0.95}
                        style={[styles.operateBtn, styles.cancelBtn, cancelTextStyle]}
                        onPress={() => this.handleCancel()}
                      >
                        <Text style={[styles.btnText, cancelTextStyle]}>{cancelText || 'Cancel'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.95}
                        style={[styles.operateBtn, styles.okBtn, okTextStyle]}
                        onPress={() => this.handleCallback()}
                      >
                        <Text style={[styles.btnText, okTextStyle]}>{okText || 'OK'}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
            </Animated.View>
            </View>
          ) : null
        }
      </View>
    );
  }
}

export default Dropdown;

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menusView: {
    // flex: 1,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: transPxToDp(100),
    paddingHorizontal: transPxToDp(30),
    backgroundColor: '#fff',
    borderBottomColor: 'rgb(224,224,224)',
    borderBottomWidth: transPxToDp(2),
  },
  menusText: {
    fontSize: transPxToDp(28),
    color: 'rgb(51,51,51)',
  },
  menusIconDown: {
    width: transPxToDp(24),
    marginLeft: transPxToDp(16),
  },
  listView: {
    position: 'absolute',
    width: '100%',
    // height: 200,
    backgroundColor: '#fff',
    marginTop: transPxToDp(100),
    zIndex: 1,
    borderBottomWidth: transPxToDp(2),
    borderBottomColor: 'rgb(224,224,224)',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: transPxToDp(50),
    paddingVertical: transPxToDp(20),
    borderBottomColor: 'rgb(245,245,245)',
    borderBottomWidth: transPxToDp(2),
  },
  listName: {
    fontSize: transPxToDp(28),
    color: 'rgb(51,51,51)',
  },
  textSelected: {
    color: 'rgb(66,204,203)',
  },
  operateView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  operateBtn: {
    flex: 1,
    // paddingHorizontal: 15,
    // paddingVertical: 10,
    height: transPxToDp(100),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  cancelBtn: {
    backgroundColor: 'rgb(126,227,202)',
  },
  okBtn: {
    backgroundColor: 'rgb(66,224,203)',
  },
  btnText: {
    color: '#fff',
    fontSize: transPxToDp(28),
  },
});
