import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';
import styles from './PromigasEnlacesInteresWebPart.module.scss';
import * as strings from 'PromigasEnlacesInteresWebPartStrings';
import PnpServices from '../promigasEnlacesInteres/services/PnpServices';
import RenderWebPart from '../promigasEnlacesInteres/render/RenderWebPart';

export interface IPromigasEnlacesInteresWebPartProps {
  list: string;
  selectedList: string;
  columnas: string;
}

export default class PromigasEnlacesInteresWebPart extends BaseClientSideWebPart<IPromigasEnlacesInteresWebPartProps> {

  private listDropDownOptions: IPropertyPaneDropdownOption[];
  private viewDropDownOptions: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;
  
  public render(): void {
  
    let idioma: string = localStorage.getItem('promigasLenguajeActual'); 
    idioma = idioma ? idioma : 'ESP';
    var currentSite = this.context.pageContext.site;
    this.domElement.innerHTML =  RenderWebPart.RenderTemplateWebPart(this.properties);
    RenderWebPart.GetRenderWebPart(this.properties, idioma, currentSite.absoluteUrl);
  }

  protected onInit(): Promise<void> {
    this.listDropDownOptions = [];
    this.viewDropDownOptions = [];
    return super.onInit();
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.listDropDownOptions;
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'list');
    this.loadLists();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): void {
    if (propertyPath === 'listOfList' && newValue) {
      this.properties.selectedList = newValue;
    } else {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('list', {
                  label: "Biblioteca",
                  options: this.listDropDownOptions,
                  disabled : this.listsDropdownDisabled
                }),
                PropertyPaneSlider('columnas', {
                  label: "Columnas",
                  min: 1,
                  max: 4
                })
              ]
            }
          ]
        }
      ]
    };
  }
  private async loadLists(): Promise<string> {
    await PnpServices.GetLists()
    .then((response) => {
        for (let i: number = 0 ; i < response.length ; i++) {
          this.listDropDownOptions.push({key: response[i].Title, text: response[i].Title});
        }
        this.listsDropdownDisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      })
      .catch((e) =>
        console.error('Error al ejecutar ObtnerVideosSharepoint', e)
      );

      return 'listo';
  }
}
