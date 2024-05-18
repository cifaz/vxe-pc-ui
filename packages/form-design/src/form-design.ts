import { defineComponent, ref, h, PropType, reactive, provide, watch, nextTick } from 'vue'
import globalConfigStore from '../../ui/src/globalStore'
import { renderer } from '../../ui/src/renderer'
import { getI18n } from '../../ui/src/i18n'
import { toCssUnit } from '../../ui/src/dom'
import { FormDesignWidgetInfo } from './widget-info'
import XEUtils from 'xe-utils'
import LayoutWidgetComponent from './layout-widget'
import LayoutViewComponent from './layout-view'
import LayoutSettingComponent from './layout-setting'
import { getDefaultSettingFormData } from './setting-data'

import { VxeFormPropTypes, VxeFormDesignDefines, VxeFormDesignPropTypes, VxeFormDesignEmits, FormDesignReactData, FormDesignPrivateRef, VxeFormDesignPrivateComputed, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, FormDesignMethods, FormDesignPrivateMethods, VxeFormProps } from '../../../types'

export default defineComponent({
  name: 'VxeFormDesign',
  props: {
    size: {
      type: String as PropType<VxeFormDesignPropTypes.Size>,
      default: () => globalConfigStore.formDesign.size
    },
    height: [String, Number] as PropType<VxeFormDesignPropTypes.Height>,
    widgets: {
      type: Array as PropType<VxeFormDesignPropTypes.Widgets>,
      default: () => XEUtils.clone(globalConfigStore.formDesign.widgets) || []
    },
    formData: {
      type: Array as PropType<VxeFormDesignPropTypes.FormData>,
      default: () => XEUtils.clone(globalConfigStore.formDesign.formData, true)
    },
    formRender: Object as PropType<VxeFormDesignPropTypes.FormRender>
  },
  emits: [
    'click-widget',
    'add-widget',
    'copy-widget',
    'remove-widget'
  ] as VxeFormDesignEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormDesignReactData>({
      formConfig: {},
      formData: {} as VxeFormDesignDefines.DefaultSettingFormObjVO,
      formItems: [],
      widgetConfigs: [],
      widgetObjList: [],
      dragWidget: null,
      sortWidget: null,
      activeWidget: null
    })

    const refMaps: FormDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeFormDesignPrivateComputed = {
    }

    const $xeFormDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormDesignConstructor & VxeFormDesignPrivateMethods

    const createWidget = (name: string) => {
      return new FormDesignWidgetInfo(name, reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const createEmptyWidget = () => {
      return new FormDesignWidgetInfo('', reactData.widgetObjList) as VxeFormDesignDefines.WidgetObjItem
    }

    const getFormConfig = (): VxeFormProps => {
      return Object.assign({}, reactData.formConfig)
    }

    const loadFormConfig = (formData: VxeFormProps) => {
      reactData.formConfig = Object.assign({}, formData)
      return nextTick()
    }

    const getWidgetData = (): VxeFormDesignDefines.WidgetObjItem[] => {
      return reactData.widgetObjList.slice(0)
    }

    const loadWidgetData = (widgetData: VxeFormDesignDefines.WidgetObjItem[]) => {
      reactData.widgetObjList = widgetData ? widgetData.slice(0) : []
      return nextTick()
    }

    const formDesignMethods: FormDesignMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $xeFormDesign, $event: evnt }, params))
      },
      createWidget,
      createEmptyWidget,
      getConfig () {
        return {
          formData: getFormConfig(),
          widgetData: getWidgetData()
        }
      },
      loadConfig (config) {
        if (config) {
          const { formData, widgetData } = config
          if (formData) {
            loadFormConfig(formData)
          }
          if (widgetData) {
            loadWidgetData(widgetData)
          }
        }
        return nextTick()
      },
      getFormConfig,
      loadFormConfig,
      getWidgetData,
      loadWidgetData
    }

    const updateWidgetConfigs = () => {
      const { widgets } = props
      let widgetConfs: VxeFormDesignDefines.WidgetConfigItem[] = []
      if (widgets && widgets.length) {
        widgetConfs = props.widgets.slice(0)
      } else {
        const baseWidgets: string[] = []
        const layoutWidgets: string[] = []
        const advancedWidgets: string[] = []
        const customGroups: VxeFormDesignDefines.WidgetConfigItem[] = []
        renderer.forEach((item, name) => {
          const { formDesignWidgetName, formDesignWidgetGroup, formDesignWidgetCustomGroup } = item
          if (formDesignWidgetName) {
            // 如果自定义组
            if (formDesignWidgetCustomGroup) {
              const cusGroup = customGroups.find(item => item.title === formDesignWidgetCustomGroup)
              if (cusGroup) {
                cusGroup.children.push(name)
              } else {
                customGroups.push({
                  title: formDesignWidgetCustomGroup,
                  children: [name]
                })
              }
            } else {
              switch (formDesignWidgetGroup) {
                case 'layout':
                  layoutWidgets.push(name)
                  break
                case 'advanced':
                  advancedWidgets.push(name)
                  break
                default:
                  baseWidgets.push(name)
                  break
              }
            }
          }
        })
        if (baseWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.baseGroup'),
            children: baseWidgets
          })
        }
        if (layoutWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.layoutGroup'),
            children: layoutWidgets
          })
        }
        if (advancedWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.advancedGroup'),
            children: advancedWidgets
          })
        }
        if (customGroups.length) {
          widgetConfs.push(...customGroups)
        }
      }
      reactData.widgetConfigs = widgetConfs
    }

    const formDesignPrivateMethods: FormDesignPrivateMethods = {
      handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        reactData.activeWidget = item
        formDesignMethods.dispatchEvent('click-widget', { item }, evnt)
      },
      handleCopyWidget (evnt: KeyboardEvent, widget: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const rest = XEUtils.findTree(widgetObjList, obj => obj.id === widget.id, { children: 'children' })
        if (rest) {
          evnt.stopPropagation()
          const { path } = rest
          const rootIndex = Number(path[0])
          const newWidget = createWidget(widget.name)
          // 标题副本
          if (newWidget.widgetFormData.itemTitle) {
            newWidget.widgetFormData.itemTitle = getI18n('vxe.formDesign.widget.copyTitle', [`${widget.widgetFormData.itemTitle}`.replace(getI18n('vxe.formDesign.widget.copyTitle', ['']), '')])
          }
          if (rootIndex >= widgetObjList.length - 1) {
            widgetObjList.push(newWidget)
          } else {
            widgetObjList.splice(rootIndex + 1, 0, newWidget)
          }
          reactData.activeWidget = newWidget
          reactData.widgetObjList = [...widgetObjList]
          formDesignMethods.dispatchEvent('copy-widget', { widget, newWidget }, evnt)
        }
      },
      handleRemoveWidget (evnt: KeyboardEvent, widget: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const rest = XEUtils.findTree(widgetObjList, obj => obj.id === widget.id, { children: 'children' })
        if (rest) {
          const { index, parent, items } = rest
          evnt.stopPropagation()
          if (index >= items.length - 1) {
            reactData.activeWidget = items[index - 1]
          } else {
            reactData.activeWidget = items[index + 1] || null
          }
          // 如果是子控件
          if (parent) {
            items[index] = createEmptyWidget()
          } else {
            items.splice(index, 1)
          }
          reactData.widgetObjList = [...widgetObjList]
          formDesignMethods.dispatchEvent('remove-widget', { widget }, evnt)
        }
      }
    }

    const createSettingForm = () => {
      const { formRender } = props
      let formConfig: VxeFormProps = getDefaultSettingFormData()
      let formData = {} as VxeFormDesignDefines.DefaultSettingFormObjVO
      let formItems: VxeFormPropTypes.Items = []
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createFormDesignSettingFormConfig : null
        formConfig = (createFormConfig ? createFormConfig({}) : {}) || {}
      }
      formData = formConfig.data || {}
      formItems = formConfig.items || []
      delete formConfig.data
      delete formConfig.items

      reactData.formConfig = formConfig
      reactData.formData = formData
      reactData.formItems = formItems
    }

    Object.assign($xeFormDesign, formDesignMethods, formDesignPrivateMethods)

    const renderVN = () => {
      const { height } = props
      return h('div', {
        ref: refElem,
        class: 'vxe-design-form',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h(LayoutWidgetComponent),
        h(LayoutViewComponent),
        h(LayoutSettingComponent)
      ])
    }

    $xeFormDesign.renderVN = renderVN

    watch(() => props.widgets, () => {
      updateWidgetConfigs()
    })

    watch(() => props.formRender, () => {
      createSettingForm()
    })

    createSettingForm()
    updateWidgetConfigs()

    provide('$xeFormDesign', $xeFormDesign)

    return $xeFormDesign
  },
  render () {
    return this.renderVN()
  }
})
