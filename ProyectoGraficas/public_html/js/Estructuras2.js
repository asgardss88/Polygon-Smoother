/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function MeshGenerator() {
    this.vertex_array = new Array();
    this.half_edges = new Array();
    this.geometry = new THREE.Geometry();
    this.index = 0;
    this.newIndex = 0;
   // alert("vertices: " + this.geometry.vertices.length + " caras:" + this.geometry.faces.length);



    this.add_vertices = function(lsv) {
        var aux_v;
        for (i in lsv) {
            aux_v = new Vertex(lsv[i].x, lsv[i].y, lsv[i].z);
            this.vertex_array.push(aux_v);
            aux_v.index = this.index;
            this.index++;

        }

        this.newIndex = this.index;
      //  alert("cant vert:" + this.vertex_array);


    };

    this.add_faces = function(fls) {
        var fst, scd, trd;
        var indexer = new TwinIndexer();
        for (i in fls) {
            fst = new Half_Edge(this.vertex_array[fls[i].a], fls[i]);
            scd = new Half_Edge(this.vertex_array[fls[i].b], fls[i]);
            trd = new Half_Edge(this.vertex_array[fls[i].c], fls[i]);

            fst.setNext(scd);
            scd.setNext(trd);
            trd.setNext(fst);

            this.vertex_array[fls[i].a].setHalfEdge(fst);
            this.vertex_array[fls[i].b].setHalfEdge(scd);
            // console.log(fls[i].c);
            // console.log(this.vertex_array[fls[i].c].x+" "+this.vertex_array[fls[i].c].y+" "+this.vertex_array[fls[i].c].z);
            this.vertex_array[fls[i].c].setHalfEdge(trd);

            indexer.addKey(fls[i].c, fls[i].a, fst);
            indexer.addKey(fls[i].a, fls[i].b, scd);
            indexer.addKey(fls[i].b, fls[i].c, trd);

            this.half_edges.push(fst);
            this.half_edges.push(scd);
            this.half_edges.push(trd);
            
        }

        indexer.connectTwins(this.half_edges);
    };

    this.generate = function(geom) {

        var fst, scd, trd, vec, vert1, vert2, vert3;

        this.add_vertices(geom.vertices);
        this.add_faces(geom.faces);

        for (i in this.half_edges) {

            fst = this.half_edges[i];

          if(!fst.visitado){
            if (fst.medium === null) {


                vec = fst.calcularImpar();
                vert1 = new Vertex(vec.x, vec.y, vec.z);
                vert1.index = this.newIndex;
                this.vertex_array.push(vert1);
                fst.setMedium(vert1);
                
                this.newIndex++;
            } else {
                vert1 = fst.medium;
            }
            fst.visitado=true;
            scd = fst.next;

            if (scd.medium === null) {
                vec = scd.calcularImpar();
                vert2 = new Vertex(vec.x, vec.y, vec.z);
                vert2.index = this.newIndex;
                this.vertex_array.push(vert2);
                scd.setMedium(vert2);
                
                this.newIndex++;
            } else {
                vert2 = scd.medium;
            }
            
            scd.visitado=true;

            trd = scd.next;
            if (trd.medium === null) {
                
                vec = trd.calcularImpar();
                vert3 = new Vertex(vec.x, vec.y, vec.z);
                vert3.index = this.newIndex;
                this.vertex_array.push(vert3);
                trd.setMedium(vert3);
                 
                this.newIndex++;
            } else {
                vert3 = trd.medium;
            }
            trd.visitado=true;

            this.geometry.faces.push(new THREE.Face3(vert1.index, fst.vertex.index, vert2.index));
            this.geometry.faces.push(new THREE.Face3(vert2.index, scd.vertex.index, vert3.index));
            this.geometry.faces.push(new THREE.Face3(vert3.index, trd.vertex.index, vert1.index));
            this.geometry.faces.push(new THREE.Face3(vert1.index, vert2.index, vert3.index));


          }


        }

        var n = 0;
      //  alert("vertices1: " + this.geometry.vertices.length + " caras:" + this.geometry.faces.length);
        while (n < this.index) {
            this.vertex_array[n].calcularPares();
            this.geometry.vertices.push(this.vertex_array[n].vector);
           
            n++;
        }

        while (n < this.newIndex) {
            this.geometry.vertices.push(this.vertex_array[n].vector);
            n++;
        }

      //  alert("vertices: " + this.geometry.vertices.length + " caras:" + this.geometry.faces.length);
       // alert("instancia: " + this.newIndex);
        return this.geometry;

    };


}

function TwinIndexer() {
    this.hash = new Object();
    // se le pasa i1 e i2 los indices del arreglo de vertices
    this.addKey = function(i1, i2, half) {
        var key = Math.max(i1, i2) + '_' + Math.min(i1, i2);
        var expr = this.hash[key];
        if (expr === undefined) {
            this.hash[key] = [half];
        } else {
            expr.push(half);
        }

    };

    this.connectTwins = function(lst) {

        for (i in this.hash) {

            var temp = this.hash[i];
            if (temp.length === 2) {
                temp[0].setTwin(temp[1]);
                temp[1].setTwin(temp[0]);
                //  console.log("bien");
            } else {
                // var aux = new Half_Edge(temp[0].next.next.vertex,null);
                temp[0].setTwin(new Half_Edge(temp[0].next.next.vertex, null));
                //  lst.push(aux);
                alert("solo " + i + " con length " + temp[0].next.next.vertex);
            }
        }

    };




}

function Vertex(x, y, z) {
    this.vector = new THREE.Vector3(x, y, z);
    this.halfedge = null;
    this.x = this.vector.x;
    this.y = this.vector.y;
    this.z = this.vector.z;
    this.index = null;

    this.setHalfEdge = function(edge) {
        if (this.halfedge === null) {
            this.halfedge = edge;
        }

    };



    this.clone = function() {
        var cpy_vector = new THREE.Vector3(0, 0, 0);
        cpy_vector.copy(this.vec);
        var copy = new Vertex(cpy_vector);
        copy.setHalfedge(this.halfedge);
        return copy;

    };

    this.calcularPares = function() {
        var n = 0;

        var actual = this.halfedge.next;
        var vecinos = [];

        do {
            vecinos[n] = actual.vertex;
            actual = actual.twin.next;
            n++;

        } while (vecinos[0] !== actual.vertex)


        var beta = (3 / 8) + Math.pow((3 / 8) + (1 / 4) * Math.cos(2 * Math.PI / n), 2);

        var acum = new THREE.Vector3(0, 0, 0);
        acum.copy(vecinos[0].vector);
        var i = 1;

        while (i < vecinos.length) {
            acum.add(vecinos[i].vector);
            i++;
        }

        acum.multiplyScalar((1 - beta) / n);

        this.vector.multiplyScalar(beta).add(acum);



    };


}

function Half_Edge(vertex, face) {
    this.vertex = vertex;
    this.face = face;
    this.twin = null;
    this.medium = null;
    this.next = null;
    this.visitado=false;

    this.setTwin = function(tw) {
        this.twin = tw;
    };

    this.setMedium = function(med_ver) {
        this.medium = med_ver;
        this.twin.medium = med_ver;
    };

    this.setNext = function(next_edge) {
        this.next = next_edge;
    };

    this.getFaceVertex = function() {
        return [this.vertex, this.next.medium, this.next.vertex, this.next.next.medium, this.next.next.vertex, this.medium];
    };

    this.calcularImpar = function( ) {
        var sides, top;

        var v1 = this.vertex;
        var v2 = this.next.vertex;
        var v3 = (this.twin).vertex;
        var v4 = ((this.twin).next).vertex;

        sides = new THREE.Vector3(0, 0, 0);




        sides.addVectors(v1.vector, v3.vector);
        sides.multiplyScalar(3 / 8);
        top = new THREE.Vector3(0, 0, 0);
        top.addVectors(v2.vector, v4.vector);
        top.multiplyScalar(1 / 8);
        top.add(sides);

        return top;





    };
}



