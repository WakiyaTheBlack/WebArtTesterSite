/*
    v3
*/
//------------------------------------------------
uniform vec2 u_resolution;
uniform float u_time;

#define R u_resolution
#define T u_time

//------------------------------------------------
#define PI 3.141592653597
#define TWO_PI PI * 2.
#define PI_2 1.57079632679
#define PI_4 0.78539816339

#define HUE(h) (.5 + .5 * cos(h + vec3(23, 21, 0)))

vec3 applyFog( in vec3  rgb,      // original color of the pixel
               in float distance, // camera to point distance
               in vec3  rayDir,   // camera to point vector
               in vec3  sunDir )  // sun light direction
{
    vec3 startColor = vec3(0.1, .0, .5);
    float fogAmount = 1.0 - exp( -distance*0.02 );
    float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
    vec3  fogColor  = mix( startColor, // bluish
                           vec3(.1, 0., .9), // yellowish
                            pow(sunAmount,8.0) );
    return mix( rgb, fogColor, fogAmount );
}

vec2 modPolar(vec2 p, float n) {
    n = 6.28 / n;
    float a = mod(atan(p.y, p.x), n) - n / 2.;
    return vec2(cos(a), sin(a)) * length(p);
}

mat2 rotate(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// object material setting
float id = -1.;
void setObject(inout float m, inout float id, in float d, float new) {
    if (d < m) {
        m = d;
        id = new;
    }
}

// cell coodinate and cell id
vec3 F;
vec3 K;

float map(vec3 ro, vec3 _p) {

    vec3 P = _p;
    float m = 1e3;

    vec3 p = _p;
    float d = 1e3;

    p.y += cos(p.z * .1) * cos(p.x * .1) * 2.;
    p.y += cos(p.x * 0.01) * cos(p.z * 0.0 + T ) * .9;

    p.y = abs(p.y);
    d = (10. + 5. * cos(T + p.x * 0.05 + p.z * 0.001)) - p.y;
    setObject(m, id, d, 0.);

    return m;
}

vec3 camera(vec2 uv, vec3 ro, vec3 cu, vec3 cl) {
    vec3 cw = normalize(cl - ro);
    vec3 cr = normalize(cross(cw, cu));
    cu = normalize(cross(cr, cw));
    return uv.x * cr + uv.y * cu + cw;
}


void main() {

	vec2 uv = (2. * gl_FragCoord.xy - R) / R.y;

    vec3 col = vec3(0);

    float cz = T * 20.;
    vec3 ro = vec3(0, 0, cz);
    vec3 rd = camera(uv, ro, vec3(0, 1, 0), vec3(ro.xy, cz + 1.));

    vec3 p = vec3(0);
    float t = 0.;

    for (int i = 0; i < 128; i++) {
        p = ro + rd * t;
        float d = map(ro, p);
        t += .5 * d;
    }

    vec3 sun = vec3(0, .2, .9);

    col.gb += cos(p.z * 0.2 + T) + sin(p.x * 2. + T);
    col = mix(col, vec3(.1, .1, .2), cos(p.z * 0.05 + p.x * 0.01 + T));
    col = applyFog(col, t, rd, sun);

	gl_FragColor = vec4(col, 1.);



}