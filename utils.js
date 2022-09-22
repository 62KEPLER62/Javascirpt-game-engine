function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function getBaseLog(a,b){
    return Math.log(b)/Math.log(a);
}

let randInt = (a,b) => Math.round(a+Math.random()*(b-a));

function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function getRandomColor(){
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}



let harita = [];
w = 1000000;
h = window.innerHeight;
var M = 4294967296,
    // a - 1 should be divisible by m's prime factors
    A = 1664525,
    // c and m should be co-prime
    C = 1;
var Z = Math.floor(Math.random() * M);
function rand(){
  Z = (A * Z + C) % M;
  return Z / M - 0.5;
};

function interpolate(pa, pb, px){
	var ft = px * Math.PI,
		f = (1 - Math.cos(ft)) * 0.5;
	return pa * (1 - f) + pb * f;
}

var x = 0,
	y = h / 2,
	amp = 1000, //amplitude
	wl = 2000, //wavelength
	fq = 1 / wl, //frequency
	a = rand(),
	b = rand();
while(x < w){
	if(x % wl === 0){
		a = b;
		b = rand();
		y = h / 2 + a * amp;
	}else{
		y = h / 2 + interpolate(a, b, (x % wl) / wl) * amp;
	}
    harita.push([x-500000,y+1000])
	x += 100;
}
harita.push([x,3000])