import { sp, Web } from 'sp-pnp-js';

export default class PnpServices {

public static async GetAll_Enlaces(list: string): Promise<any[]> {
    try {
        const rootweb: Web = sp.site.rootWeb;
        const response: any[] = await rootweb.lists.getByTitle(list)
            .items
            .select(`*,FileRef,FileLeafRef`)
            .get();
            
        return response;
    } catch (ex) {
        console.error(ex);
    }
}    

 public static async GetLists(): Promise<any> {
        return sp.web.lists.filter('Hidden eq false').get().then((data) => {
          console.log('Total number of lists are ' + data.length);
          return data;
        });
    }
}