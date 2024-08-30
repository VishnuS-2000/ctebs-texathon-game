import { Component } from "@angular/core";

@Component({
    selector:'texathon-documentation',
    templateUrl:'./documentation.component.html',
    styleUrls:['./documentation.component.scss','../../../../assets/styles/colors.utility.css','../../../../assets/styles/shapes.utility.css']
})
export class CapDocumentationComponent{
    
    ngOnInit(){
      this.generateColorClass()
      this.generateShapeClass()

    }

    menus:any= ['Colors','Shapes'];
    selectedMenu:number=0;

    colors:any = ['gray','red','orange','yellow','green','teal','blue','indigo','purple','pink']
    colorScales = [100,200,300,400,500,600,700,800,900]
    colorTypes = [{name:'Background',value:'bg'},{name:'Border',value:'border'},{name:'Text',value:'text'}]
  

    colorTypeSelected:number=0;
    colorSelected:number=0;
    colorScaleSelected:number=0;

     copiedToClipBoard:boolean=false;


    shapes:any=[{name:'Circle',value:'circle',sizes:[50,100,150,200,250,300,350,400,450,500]}
    ,{name:'Square',value:'square',sizes:[50,100,150,200,250,300,350,400,450,500]}
    ,{name:'Triangle',value:'triangle',sizes:[50,100,150,200,250,300,350,400]}
  ]
    shapeSelected:number = 0;
    shapeSizeSelected:number=0;


    currentColorSelectedClass:any=['','',''];
    currentShapeSelectedClass:string = ''
    constructor(){
        
    }
    selectColorType(index:any){
        this.colorTypeSelected = index;

    }

    getColorClass(color: string, scale: number): string {
        const colorTypeValue = this.colorTypes[this.colorTypeSelected]?.value;
        return `${String(colorTypeValue)}-${color}-${scale}`;
      }

    get colorClass(){
      return `${this.currentColorSelectedClass[0]} ${this.currentColorSelectedClass[1]} ${this.currentColorSelectedClass[2]} ` 
    }

    get shapeColorClass(){
      return `${this.currentShapeSelectedClass} ${this.colorClass}`
    }


      selectColorScale(colorIndex:any,scaleIndex:any){
        this.colorSelected = colorIndex
        this.colorScaleSelected = scaleIndex;
        this.generateColorClass();
      }

      generateColorClass(){
        const color = this.colors[this.colorSelected]
        const scale = this.colorScales[this.colorScaleSelected]
        if(!this.currentColorSelectedClass[this.colorTypeSelected]){
          this.currentColorSelectedClass[this.colorTypeSelected]='';
        }
        this.currentColorSelectedClass[this.colorTypeSelected] = this.getColorClass(color,scale);
      }

      generateShapeClass(){
        
        const className =  `${this.shapes[this.shapeSelected]?.value}-${this.shapes[this.shapeSelected]?.sizes[this.shapeSizeSelected]}`;

        console.log(className);
        return className;
      }


      selectMenu(index:any){
        this.selectedMenu = index;
      }

      selectShape(index:any){
        this.shapeSelected = index;
        this.shapeSizeSelected = 0;
        this.currentShapeSelectedClass = this.generateShapeClass()
      }   

      selectShapeSize(index:any){
        this.shapeSizeSelected = index;
        this.currentShapeSelectedClass = this.generateShapeClass()
      }


      copyToClipBoard(text:any){
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(
            () =>{
              this.copiedToClipBoard = true;
              setTimeout(()=>this.copiedToClipBoard = false,2000)
            },
            (err) => console.error('Copy failed', err)
          );
        } 
      }
      
      
}