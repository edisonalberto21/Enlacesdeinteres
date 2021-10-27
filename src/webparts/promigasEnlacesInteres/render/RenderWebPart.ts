import PnpServices from '../services/PnpServices';
import { IPromigasEnlacesInteresWebPartProps } from '../PromigasEnlacesInteresWebPart';


export default class RenderWebPart {

    public static RenderTemplateWebPart(properties: IPromigasEnlacesInteresWebPartProps){  
    
        return `
        <section >
        <div class="row pb-4" id="enlacesInteres"></div>
        </section>
        `;  
     }

     public static GetRenderWebPart(
        properties: IPromigasEnlacesInteresWebPartProps, idioma: string, sitio: string
      ): void {
        this.GetHtmlElements(properties, idioma, sitio);
      }

      private static async GetHtmlElements(
        properties: IPromigasEnlacesInteresWebPartProps, idioma: string, sitio: string
      ): Promise<void> {    
        await PnpServices.GetAll_Enlaces(properties.list)
          .then((response) => {
            this.RenderElements(properties, response, idioma, sitio);
          })
          //.catch((e) => this.RenderErrorElements(properties));
      }

      private static RenderElements(
        properties: IPromigasEnlacesInteresWebPartProps,
        items: any[],
        idioma: string, sitio: string
      ): void {
        let elements: string = '';    
        let index: number = 0;
        items.forEach((item: any) => {
            
          elements += ` <div class="col-12 col-md-${this.ObtenerNumeroColumnas(properties.columnas)} d-flex align-items-center" style="border-left: 1px solid #ccc;">
                           <ul class="p-0">
                            <li class="d-flex align-items-center">
                                <figure class="figure mb-0">
                                    <a href="${("ENG" === idioma ? item.UrlDestino_ENG ? item.UrlDestino_ENG:"   " : item.UrlDestino ? item.UrlDestino:" ")}">
                                    <img src="${item.FileRef}" class="figure-img img-fluid rounded" alt=\'${("ENG"=== idioma ? item.Title_ENG ? item.Title_ENG:"   ": item.Title ? item.Title:" ")}\' style="max-width: 60px; margin-bottom: 0;">
                                    </a>
                                </figure>
                                <p style="font-size:1em" class="pl-2">${"ENG" === idioma?item.Title_ENG ? item.Title_ENG:"   ":item.Title ? item.Title:" "}</p>
                            </li>
                        </ul>
                    </div>  
          `;      
          
          index++;
        });
    
          document.querySelector('#enlacesInteres').innerHTML = elements;
       }

       private static ObtenerNumeroColumnas(columnas: any):number{
        if(columnas){
          if(columnas===2)
          {
            return 6;
          }
          if(columnas===3)
          {
            return 4;
          }
          if(columnas===4)
          {
            return 3;
          }
          return 12;
        }
        return 12;
      }
}