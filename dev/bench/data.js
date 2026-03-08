window.BENCHMARK_DATA = {
  "lastUpdate": 1772987543989,
  "repoUrl": "https://github.com/vbomfim/openasr",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be1b3ab8d2b9b52ba4807987e7892e3c3e15d370",
          "message": "feat: add Google Benchmark integration + ring buffer benchmarks + CI workflow (#89) (#90)\n\n* feat: add Google Benchmark integration + ring buffer benchmarks + CI workflow (#89)\n\nPR 1/4 of benchmark suite. Adds:\n- BUILD_BENCHMARKS CMake option with Google Benchmark v1.9.1\n- benchmarks/bench_ring_buffer.cpp with 4 parameterized benchmarks\n- benchmarks/helpers/synthetic_audio.hpp for test data generation\n- .github/workflows/benchmark.yml with regression detection\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address code review findings on benchmark PR (#89)\n\n- Add ClobberMemory() to BM_RingBuffer_ExtractWindow (prevent loop hoisting)\n- Fix inflated SetBytesProcessed in WriteWrapAround (use min of chunk/capacity)\n- Remove Arg(48000) from WriteWrapAround (tests truncation, not wrap-around)\n- Add SYSTEM include dirs for benchmark::benchmark headers\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: handle missing gh-pages branch on first benchmark run (#89)\n\nThe benchmark-action fails with 'fatal: couldn't find remote ref gh-pages'\non the first run before any baseline exists. Add a check step that detects\nwhether gh-pages exists and skips fetch/comparison on first run.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* ci: re-trigger after gh-pages branch creation\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T12:30:00-04:00",
          "tree_id": "ff5d00324dd7b1a3b506a932f2d14ea747369b21",
          "url": "https://github.com/vbomfim/openasr/commit/be1b3ab8d2b9b52ba4807987e7892e3c3e15d370"
        },
        "date": 1772987543612,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 10.686941102124607,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 10.686613407459847 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 11.011227348953097,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 11.01109760151703 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 8.996051048902624,
            "unit": "ns/iter",
            "extra": "iterations: 65542721\ncpu: 8.995408612956421 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 10.231406499993442,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.231039873977766 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 10.686941102124607,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.686613407459847 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_stddev",
            "value": 1.0820664075625814,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.082317401670218 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_cv",
            "value": 0.10575930176982755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1057876242299718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 38.80495880453133,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 38.803900818368426 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 38.76806354566129,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 38.76599550242291 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 36.701549993503846,
            "unit": "ns/iter",
            "extra": "iterations: 18047495\ncpu: 36.69887150543606 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 38.09152411456549,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 38.08958927540913 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 38.76806354566129,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 38.76599550242291 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_stddev",
            "value": 1.2038942469949574,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.2045460306827545 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_cv",
            "value": 0.031605305247804735,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03162402256357268 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 132.0257116027321,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 132.02151058704175 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 131.9913771501083,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 131.9803275575097 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 130.65981589162317,
            "unit": "ns/iter",
            "extra": "iterations: 5307526\ncpu: 130.6540985385659 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 131.5589682148212,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 131.55197889437244 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 131.9913771501083,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 131.9803275575097 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_stddev",
            "value": 0.778877967907894,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.7778597948828673 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_cv",
            "value": 0.005920371514590117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0059129463609774915 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 501.6105608074663,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 501.614181905844 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 502.2809655210014,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 502.2524229144426 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 501.72671074835966,
            "unit": "ns/iter",
            "extra": "iterations: 1393776\ncpu: 501.69638736784054 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 501.8727456922757,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 501.85433072937576 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 501.72671074835966,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 501.69638736784054 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_stddev",
            "value": 0.3582670424466809,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.34719947487884145 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_cv",
            "value": 0.0007138603271881056,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006918331747266883 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2297.2495818086713,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2297.0577986147396 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2294.4377188970248,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2294.278972817567 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 2296.864453737563,
            "unit": "ns/iter",
            "extra": "iterations: 306080\ncpu: 2296.8498823836876 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 2296.1839181477526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2296.0622179386646 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 2296.864453737563,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2296.8498823836876 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_stddev",
            "value": 1.5244637668593448,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.5478306307540375 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_cv",
            "value": 0.0006639118734395953,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006741239930961596 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 7060.81286065927,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 7060.103597514212 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 7049.7942778739725,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 7049.352164965099 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 6954.025745530759,
            "unit": "ns/iter",
            "extra": "iterations: 99124\ncpu: 6953.882894152785 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 7021.544294688002,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7021.112885544032 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 7049.794277873972,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7049.352164965098 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_stddev",
            "value": 58.73174739333149,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 58.47052361932512 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_cv",
            "value": 0.008364505716750051,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.008327814204456352 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.60191132976526,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.601357283223669 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.554826759315995,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.553998472940778 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 8.512434220533862,
            "unit": "ns/iter",
            "extra": "iterations: 80655679\ncpu: 8.512320205003782 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 8.556390769871705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8.555891987056075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 8.554826759315995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8.553998472940778 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_stddev",
            "value": 0.04475905345157391,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.044548730299271345 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_cv",
            "value": 0.0052310670065674235,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.005206789703127113 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 31.06530257048821,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 31.062409048437285 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 31.060115087819078,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 31.059254345862524 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 27.329389223797172,
            "unit": "ns/iter",
            "extra": "iterations: 22448075\ncpu: 27.327078067941258 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 29.818268960701488,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 29.816247154080358 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 31.060115087819085,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31.059254345862524 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_stddev",
            "value": 2.1554346397127833,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.1556842399989797 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_cv",
            "value": 0.07228570654297552,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.07229897944094464 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 79.64808634274377,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 79.63874548345383 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 79.6110835126037,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 79.60885753213056 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 84.95562178944368,
            "unit": "ns/iter",
            "extra": "iterations: 8790733\ncpu: 84.94968349055766 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 81.4049305482637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 81.39909550204735 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 79.64808634274375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 79.63874548345383 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_stddev",
            "value": 3.0750444744758654,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3.074935709982024 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_cv",
            "value": 0.037774671064337066,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.037776042731392304 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1396.2843787166553,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1396.2096087994178 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1397.3493027673578,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1397.1847027881322 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1318.9109422019142,
            "unit": "ns/iter",
            "extra": "iterations: 501124\ncpu: 1318.8048067943269 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1370.848207895309,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1370.7330394606254 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1396.2843787166555,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1396.2096087994178 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_stddev",
            "value": 44.98214303018469,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 44.97381141237718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_cv",
            "value": 0.032813365309968694,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.032810044055021886 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1429.2488066288438,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1429.2106781132031 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1429.3333988357035,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1429.1796381813244 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1427.1368508101655,
            "unit": "ns/iter",
            "extra": "iterations: 488532\ncpu: 1427.0166519286358 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1428.5730187582376,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1428.4689894077212 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1429.2488066288436,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1429.1796381813247 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_stddev",
            "value": 1.2444768947501024,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.2578569013317151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_cv",
            "value": 0.0008711328566402872,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0008805629738264418 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.1442693699046815,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14425981280631492 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.14416201692997524,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14415375368973044 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.144064468835594,
            "unit": "ns/iter",
            "extra": "iterations: 4859110811\ncpu: 0.14405370575526075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.14416528522341693,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.14415575741710202 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.14416201692997524,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1441537536897304 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_stddev",
            "value": 0.00010248962549138053,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00010306813437329185 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_cv",
            "value": 0.00071091750925023,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007149775785581236 ns\nthreads: 1"
          }
        ]
      }
    ]
  }
}