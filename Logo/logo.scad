
length = 10;
n = 5;

// Draw all geometry
//translate([0,0]) polygon(ngon(n, length));

translate([0,0]) hollow_ngon(n, length);



// Simple list comprehension for creating N-gon vertices
function ngon(num, r) = 
  [for (i=[0:num-1], a=i*360/num) [ r*cos(a), r*sin(a) ]];



module hollow_ngon(num, r, width = 1) {
   difference() {
      translate([0,0]) polygon(ngon(num, r));
      translate([0,0]) polygon(ngon(num, r-width));
   }
}

l = 10;


CubePoints = [
  [  0,  0,  0 ],  //0
  [ 10,  0,  0 ],  //1
  [ 10,  7,  0 ],  //2
  [  0,  7,  0 ],  //3
  [  0,  0,  5 ],  //4
  [ 10,  0,  5 ],  //5
  [ 10,  7,  5 ],  //6
  [  0,  7,  5 ]]; //7
  
CubeFaces = [
  [0,1,2,3],  // bottom
  [4,5,1,0],  // front
  [7,6,5,4],  // top
  [5,6,2,1],  // right
  [6,7,3,2],  // back
  [7,4,0,3]]; // left
  
polyhedron( CubePoints, CubeFaces );

//The coordinates of the 12 additional vertices are (0, ±(1 + h), ±(1 − h2)), (±(1 + h), ±(1 − h2), 0) and (±(1 − h2), 0, ±(1 + h)).
// (0, ±(1 + h), ±(1 − h2)), 
  // (0, (1 + h), (1 − h2) ),
// (±(1 + h), ±(1 − h2), 0) 
// (±(1 − h2), 0, ±(1 + h))

steps = 50;
sides = 5;


vert = [
  
]


points = [
	// first expression generating the points in the positive Y quadrant
  //(0, ±(1 + h), ±(1 − h2)),	
  for (a = [0 : sides]) [ a, 10 * sin(a * 360 / steps) + 10 ],
	// second expression generating the points in the negative Y quadrant
	for (a = [steps : -1 : 0]) [ a, 10 * cos(a * 360 / steps) - 20 ],
	// additional list of fixed points
	[ 10, -3 ], [ 3, 0 ], [ 10, 3 ]
];

polygon(points);
