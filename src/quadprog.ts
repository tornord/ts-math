var vsmall = (function () {
  var epsilon = 1.0e-60,
    tmpa,
    tmpb;

  do {
    epsilon = epsilon + epsilon;
    tmpa = 1 + 0.1 * epsilon;
    tmpb = 1 + 0.2 * epsilon;
  } while (tmpa <= 1 || tmpb <= 1);

  return epsilon;
})();

function dpori(a: number[][], lda: number, n: number) {
  var i, j, k, kp1, t;

  for (k = 1; k <= n; k = k + 1) {
    a[k][k] = 1 / a[k][k];
    t = -a[k][k];
    // dscal(k - 1, t, a[1][k], 1);
    for (i = 1; i < k; i = i + 1) {
      a[i][k] = t * a[i][k];
    }

    kp1 = k + 1;
    if (n < kp1) {
      break;
    }
    for (j = kp1; j <= n; j = j + 1) {
      t = a[k][j];
      a[k][j] = 0;
      // daxpy(k, t, a[1][k], 1, a[1][j], 1);
      for (i = 1; i <= k; i = i + 1) {
        a[i][j] = a[i][j] + t * a[i][k];
      }
    }
  }
}

function dposl(a: number[][], lda: number, n: number, b: number[]) {
  var i, k, kb, t;

  for (k = 1; k <= n; k = k + 1) {
    // t = ddot(k - 1, a[1][k], 1, b[1], 1);
    t = 0;
    for (i = 1; i < k; i = i + 1) {
      t = t + a[i][k] * b[i];
    }

    b[k] = (b[k] - t) / a[k][k];
  }

  for (kb = 1; kb <= n; kb = kb + 1) {
    k = n + 1 - kb;
    b[k] = b[k] / a[k][k];
    t = -b[k];
    // daxpy(k - 1, t, a[1][k], 1, b[1], 1);
    for (i = 1; i < k; i = i + 1) {
      b[i] = b[i] + t * a[i][k];
    }
  }
}

function dpofa(a: number[][], lda: number, n: number, info: number[]) {
  var i, j, jm1, k, t, s;

  for (j = 1; j <= n; j = j + 1) {
    info[1] = j;
    s = 0;
    jm1 = j - 1;
    if (jm1 < 1) {
      s = a[j][j] - s;
      if (s <= 0) {
        break;
      }
      a[j][j] = Math.sqrt(s);
    } else {
      for (k = 1; k <= jm1; k = k + 1) {
        // t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
        t = a[k][j];
        for (i = 1; i < k; i = i + 1) {
          t = t - a[i][j] * a[i][k];
        }
        t = t / a[k][k];
        a[k][j] = t;
        s = s + t * t;
      }
      s = a[j][j] - s;
      if (s <= 0) {
        break;
      }
      a[j][j] = Math.sqrt(s);
    }
    info[1] = 0;
  }
}

/*eslint-disable max-len */
function qpgen2(
  dmat: number[][],
  dvec: number[],
  fddmat: number,
  n: number,
  sol: number[],
  lagr: number[],
  crval: number[],
  amat: number[][],
  bvec: number[],
  ___fdamat: any,
  q: number,
  meq: number,
  iact: number[],
  nact: number,
  iter: number[],
  work: number[],
  ierr: number[]
) {
  /*eslint-enable */
  var i,
    j,
    l: number,
    l1,
    info: number[],
    it1: number,
    iwzv: number,
    iwrv: number,
    iwrm: number,
    iwsv: number,
    iwuv: number,
    nvl: number,
    r,
    iwnbv: number,
    temp,
    sum,
    t1: number,
    tt,
    gc,
    gs,
    nu,
    t1inf,
    t2min,
    go;

  r = Math.min(n, q);
  l = 2 * n + (r * (r + 5)) / 2 + 2 * q + 1;

  for (i = 1; i <= n; i = i + 1) {
    work[i] = dvec[i];
  }
  for (i = n + 1; i <= l; i = i + 1) {
    work[i] = 0;
  }
  for (i = 1; i <= q; i = i + 1) {
    iact[i] = 0;
    lagr[i] = 0;
  }

  info = [];

  if (ierr[1] === 0) {
    dpofa(dmat, fddmat, n, info);
    if (info[1] !== 0) {
      ierr[1] = 2;
      return;
    }
    dposl(dmat, fddmat, n, dvec);
    dpori(dmat, fddmat, n);
  } else {
    for (j = 1; j <= n; j = j + 1) {
      sol[j] = 0;
      for (i = 1; i <= j; i = i + 1) {
        sol[j] = sol[j] + dmat[i][j] * dvec[i];
      }
    }
    for (j = 1; j <= n; j = j + 1) {
      dvec[j] = 0;
      for (i = j; i <= n; i = i + 1) {
        dvec[j] = dvec[j] + dmat[j][i] * sol[i];
      }
    }
  }

  crval[1] = 0;
  for (j = 1; j <= n; j = j + 1) {
    sol[j] = dvec[j];
    crval[1] = crval[1] + work[j] * sol[j];
    work[j] = 0;
    for (i = j + 1; i <= n; i = i + 1) {
      dmat[i][j] = 0;
    }
  }
  crval[1] = -crval[1] / 2;
  ierr[1] = 0;

  iwzv = n;
  iwrv = iwzv + n;
  iwuv = iwrv + r;
  iwrm = iwuv + r + 1;
  iwsv = iwrm + (r * (r + 1)) / 2;
  iwnbv = iwsv + q;

  for (i = 1; i <= q; i = i + 1) {
    sum = 0;
    for (j = 1; j <= n; j = j + 1) {
      sum = sum + amat[j][i] * amat[j][i];
    }
    work[iwnbv + i] = Math.sqrt(sum);
  }
  nact = 0;
  iter[1] = 0;
  iter[2] = 0;

  function fnGoto50() {
    iter[1] = iter[1] + 1;

    l = iwsv;
    for (i = 1; i <= q; i = i + 1) {
      l = l + 1;
      sum = -bvec[i];
      for (j = 1; j <= n; j = j + 1) {
        sum = sum + amat[j][i] * sol[j];
      }
      if (Math.abs(sum) < vsmall) {
        sum = 0;
      }
      if (i > meq) {
        work[l] = sum;
      } else {
        work[l] = -Math.abs(sum);
        if (sum > 0) {
          for (j = 1; j <= n; j = j + 1) {
            amat[j][i] = -amat[j][i];
          }
          bvec[i] = -bvec[i];
        }
      }
    }

    for (i = 1; i <= nact; i = i + 1) {
      work[iwsv + iact[i]] = 0;
    }

    nvl = 0;
    temp = 0;
    for (i = 1; i <= q; i = i + 1) {
      if (work[iwsv + i] < temp * work[iwnbv + i]) {
        nvl = i;
        temp = work[iwsv + i] / work[iwnbv + i];
      }
    }
    if (nvl === 0) {
      for (i = 1; i <= nact; i = i + 1) {
        lagr[iact[i]] = work[iwuv + i];
      }
      return 999;
    }

    return 0;
  }

  function fnGoto55() {
    for (i = 1; i <= n; i = i + 1) {
      sum = 0;
      for (j = 1; j <= n; j = j + 1) {
        sum = sum + dmat[j][i] * amat[j][nvl];
      }
      work[i] = sum;
    }

    l1 = iwzv;
    for (i = 1; i <= n; i = i + 1) {
      work[l1 + i] = 0;
    }
    for (j = nact + 1; j <= n; j = j + 1) {
      for (i = 1; i <= n; i = i + 1) {
        work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
      }
    }

    t1inf = true;
    for (i = nact; i >= 1; i = i - 1) {
      sum = work[i];
      l = iwrm + (i * (i + 3)) / 2;
      l1 = l - i;
      for (j = i + 1; j <= nact; j = j + 1) {
        sum = sum - work[l] * work[iwrv + j];
        l = l + j;
      }
      sum = sum / work[l1];
      work[iwrv + i] = sum;
      if (iact[i] <= meq) {
        continue;
      }
      if (sum <= 0) {
        continue;
      }
      t1inf = false;
      it1 = i;
    }

    if (!t1inf) {
      t1 = work[iwuv + it1] / work[iwrv + it1];
      for (i = 1; i <= nact; i = i + 1) {
        if (iact[i] <= meq) {
          continue;
        }
        if (work[iwrv + i] <= 0) {
          continue;
        }
        temp = work[iwuv + i] / work[iwrv + i];
        if (temp < t1) {
          t1 = temp;
          it1 = i;
        }
      }
    }

    sum = 0;
    for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
      sum = sum + work[i] * work[i];
    }
    if (Math.abs(sum) <= vsmall) {
      if (t1inf) {
        ierr[1] = 1;
        // GOTO 999
        return 999;
      } else {
        for (i = 1; i <= nact; i = i + 1) {
          work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
        }
        work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
        // GOTO 700
        return 700;
      }
    } else {
      sum = 0;
      for (i = 1; i <= n; i = i + 1) {
        sum = sum + work[iwzv + i] * amat[i][nvl];
      }
      tt = -work[iwsv + nvl] / sum;
      t2min = true;
      if (!t1inf) {
        if (t1 < tt) {
          tt = t1;
          t2min = false;
        }
      }

      for (i = 1; i <= n; i = i + 1) {
        sol[i] = sol[i] + tt * work[iwzv + i];
        if (Math.abs(sol[i]) < vsmall) {
          sol[i] = 0;
        }
      }

      crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);
      for (i = 1; i <= nact; i = i + 1) {
        work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
      }
      work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

      if (t2min) {
        nact = nact + 1;
        iact[nact] = nvl;

        l = iwrm + ((nact - 1) * nact) / 2 + 1;
        for (i = 1; i <= nact - 1; i = i + 1) {
          work[l] = work[i];
          l = l + 1;
        }

        if (nact === n) {
          work[l] = work[n];
        } else {
          for (i = n; i >= nact + 1; i = i - 1) {
            if (work[i] === 0) {
              continue;
            }
            gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
            gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
            if (work[i - 1] >= 0) {
              temp = Math.abs(gc * Math.sqrt(1 + (gs * gs) / (gc * gc)));
            } else {
              temp = -Math.abs(gc * Math.sqrt(1 + (gs * gs) / (gc * gc)));
            }
            gc = work[i - 1] / temp;
            gs = work[i] / temp;

            if (gc === 1) {
              continue;
            }
            if (gc === 0) {
              work[i - 1] = gs * temp;
              for (j = 1; j <= n; j = j + 1) {
                temp = dmat[j][i - 1];
                dmat[j][i - 1] = dmat[j][i];
                dmat[j][i] = temp;
              }
            } else {
              work[i - 1] = temp;
              nu = gs / (1 + gc);
              for (j = 1; j <= n; j = j + 1) {
                temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
                dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
                dmat[j][i - 1] = temp;
              }
            }
          }
          work[l] = work[nact];
        }
      } else {
        sum = -bvec[nvl];
        for (j = 1; j <= n; j = j + 1) {
          sum = sum + sol[j] * amat[j][nvl];
        }
        if (nvl > meq) {
          work[iwsv + nvl] = sum;
        } else {
          work[iwsv + nvl] = -Math.abs(sum);
          if (sum > 0) {
            for (j = 1; j <= n; j = j + 1) {
              amat[j][nvl] = -amat[j][nvl];
            }
            bvec[nvl] = -bvec[nvl];
          }
        }
        // GOTO 700
        return 700;
      }
    }

    return 0;
  }

  function fnGoto797() {
    l = iwrm + (it1 * (it1 + 1)) / 2 + 1;
    l1 = l + it1;
    if (work[l1] === 0) {
      // GOTO 798
      return 798;
    }
    gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
    gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
    if (work[l1 - 1] >= 0) {
      temp = Math.abs(gc * Math.sqrt(1 + (gs * gs) / (gc * gc)));
    } else {
      temp = -Math.abs(gc * Math.sqrt(1 + (gs * gs) / (gc * gc)));
    }
    gc = work[l1 - 1] / temp;
    gs = work[l1] / temp;

    if (gc === 1) {
      // GOTO 798
      return 798;
    }
    if (gc === 0) {
      for (i = it1 + 1; i <= nact; i = i + 1) {
        temp = work[l1 - 1];
        work[l1 - 1] = work[l1];
        work[l1] = temp;
        l1 = l1 + i;
      }
      for (i = 1; i <= n; i = i + 1) {
        temp = dmat[i][it1];
        dmat[i][it1] = dmat[i][it1 + 1];
        dmat[i][it1 + 1] = temp;
      }
    } else {
      nu = gs / (1 + gc);
      for (i = it1 + 1; i <= nact; i = i + 1) {
        temp = gc * work[l1 - 1] + gs * work[l1];
        work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
        work[l1 - 1] = temp;
        l1 = l1 + i;
      }
      for (i = 1; i <= n; i = i + 1) {
        temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
        dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
        dmat[i][it1] = temp;
      }
    }

    return 0;
  }

  function fnGoto798() {
    l1 = l - it1;
    for (i = 1; i <= it1; i = i + 1) {
      work[l1] = work[l];
      l = l + 1;
      l1 = l1 + 1;
    }

    work[iwuv + it1] = work[iwuv + it1 + 1];
    iact[it1] = iact[it1 + 1];
    it1 = it1 + 1;
    if (it1 < nact) {
      // GOTO 797
      return 797;
    }

    return 0;
  }

  function fnGoto799() {
    work[iwuv + nact] = work[iwuv + nact + 1];
    work[iwuv + nact + 1] = 0;
    iact[nact] = 0;
    nact = nact - 1;
    iter[2] = iter[2] + 1;

    return 0;
  }

  go = 0;
  for (;;) {
    go = fnGoto50();
    if (go === 999) {
      return;
    }
    for (;;) {
      go = fnGoto55();
      if (go === 0) {
        break;
      }
      if (go === 999) {
        return;
      }
      if (go === 700) {
        if (it1 === nact) {
          fnGoto799();
        } else {
          for (;;) {
            fnGoto797();
            go = fnGoto798();
            if (go !== 797) {
              break;
            }
          }
          fnGoto799();
        }
      }
    }
  }
}

export function solveQP(
  Dmat: number[][],
  dvec: number[],
  Amat: number[][],
  bvec: number[],
  meq: number = null,
  factorized: number[] = null
) {
  var i,
    n: number,
    q,
    nact,
    r,
    crval = [],
    iact = [],
    sol = [],
    lagr = [],
    work = [],
    iter = [],
    message = "";

  meq = meq || 0;
  factorized = factorized || [null, 0];
  bvec = bvec || [];

  // In Fortran the array index starts from 1
  n = Dmat.length - 1;
  q = Amat[1].length - 1;

  if (!bvec) {
    for (i = 1; i <= q; i = i + 1) {
      bvec[i] = 0;
    }
  }

  if (n !== Dmat[1].length - 1) {
    message = "Dmat is not symmetric!";
  }
  if (n !== dvec.length - 1) {
    message = "Dmat and dvec are incompatible!";
  }
  if (n !== Amat.length - 1) {
    message = "Amat and dvec are incompatible!";
  }
  if (q !== bvec.length - 1) {
    message = "Amat and bvec are incompatible!";
  }
  if (meq > q || meq < 0) {
    message = "Value of meq is invalid!";
  }

  if (message !== "") {
    return {
      message: message,
    };
  }

  for (i = 1; i <= q; i = i + 1) {
    iact[i] = 0;
    lagr[i] = 0;
  }
  nact = 0;
  r = Math.min(n, q);
  for (i = 1; i <= n; i = i + 1) {
    sol[i] = 0;
  }
  crval[1] = 0;
  for (i = 1; i <= 2 * n + (r * (r + 5)) / 2 + 2 * q + 1; i = i + 1) {
    work[i] = 0;
  }
  for (i = 1; i <= 2; i = i + 1) {
    iter[i] = 0;
  }

  qpgen2(Dmat, dvec, n, n, sol, lagr, crval, Amat, bvec, null, q, meq, iact, nact, iter, work, factorized);

  if (factorized[1] === 1) {
    message = "constraints are inconsistent, no solution!";
  }
  if (factorized[1] === 2) {
    message = "matrix D in quadratic function is not positive definite!";
  }

  return {
    solution: sol,
    Lagrangian: lagr,
    value: crval,
    unconstrainedSolution: dvec,
    iterations: iter,
    iact: iact,
    message: message,
  };
}

export function base0to1(A: any): any {
  if (typeof A !== "object") {
    return A;
  }
  var res = [],
    i,
    n = A.length;
  for (i = 0; i < n; i++) {
    res[i + 1] = base0to1(A[i]);
  }
  return res;
}

export function base1to0(A: any): any {
  if (typeof A !== "object") {
    return A;
  }
  var res = [],
    i,
    n = A.length;
  for (i = 1; i < n; i++) {
    res[i - 1] = base1to0(A[i]);
  }
  return res;
}
