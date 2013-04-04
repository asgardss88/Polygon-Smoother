/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var VERTEX_ARRAY = new Array();
var HALF_EDGES = new Array();

function Vertex(vec){
    this.vector=vec;
    this.halfedge=-1;
    this.x= this.vector.x;
    this.y= this.vector.y;
    this.z= this.vector.z;
    
    
    this.setHalfedge= function(index){
        this.halfedge=index;
        
    };
    
    this.calcularPares = function(){
        var n=0;
        
        var actual = HALF_EDGES[this.halfedge].next;
        var original = actual;
        var vecinos= [];
        
        do{
            vecinos[n] = VERTEX_ARRAY[HALF_EDGES[actual].vertex];
            actual = HALF_EDGES[HALF_EDGES[actual].twin].next;
            n++;
            
        }while(vecinos[0]!==VERTEX_ARRAY[HALF_EDGES[actual].vertex])
        
        
        var beta = (3/8)+Math.pow((3/8)+(1/4)*Math.cos(2*Math.PI/n),2);
        var acum=vecinos[0].vector;
        var i=1;
        
        while(i<vecinos.length){
            acum = acum.add(vecinos[i].vector);
            i++;
        }
        
        acum = acum.multiplyScalar((1-beta)/n);
        
        return this.vector.multiplyScalar(beta).add(acum);
        
        
        
    };
    
    
}

function Half_Edge(vertex_index,face_index){
    this.vertex = vertex_index;
    this.face = face_index;
    this.twin = -1;
    this.medium= -1;
    this.next=-1;
    
    this.setTwin = function(index){
        this.twin=index;
    };
    
    this.setMedium = function(index){
        this.medium = index;
        HALF_EDGES[this.twin].medium = index;
        
    };
    
    this.setNext= function(index){
        this.next=index;
    };

    this.getVertices= function(){
        return [this.vertex,HALF_EDGES[this.next].vertex,HALF[HALF_EDGES[this.twin].next].vertex];
    };
    
    this.calcularImpares=function( ){
        var v1 = VERTEX_ARRAY[this.vertex];
        var v2 = VERTEX_ARRAY[HALF_EDGES[this.next].vextex];
        var v3 = VERTEX_ARRAY[HALF_EDGES[this.twin].vertex];
        var v4 = VERTEX_ARRAY[HALF_EDGES[HALF_EDGES[this.twin].next].vertex];
        
        var sides = v1.vector.add(v3.vector);
        sides = sides.multiplyScalar(3/8);
        
        var top = v2.vector.add(v4.vector);
        top = top.multiplyScalar(1/8);
        
        return top.add(sides);
        
        
        
        
    };
}


