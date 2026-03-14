window.BENCHMARK_DATA = {
  "lastUpdate": 1773524398157,
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
      },
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
          "id": "6ee75a01f996cac48d935b8b878bfe5b425d40e3",
          "message": "feat: add audio pipeline and buffer engine benchmarks (#89) (#91)\n\n* ci: re-trigger after gh-pages branch creation\n\n* feat: add audio pipeline and buffer engine benchmarks (#89)\n\nPR 2/4 of benchmark suite. Adds:\n- benchmarks/bench_audio_pipeline.cpp: PCM conversion, resampling, pipeline ingest\n- benchmarks/bench_buffer_engine.cpp: windowing, VAD processing\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address review comments on audio benchmark PR (#89)\n\n- Use wss::kWhisperSampleRate constant instead of magic 16000\n- Fix unused stride_data in buffer engine benchmark (simulate streaming)\n- Fix implementation-defined signed right-shift in PCM byte generation\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address code review findings on audio benchmarks (#89)\n\n- Rename BM_BufferEngine_ExtractVADWindow → BM_BufferEngine_VADFullCycle\n  (honestly describes the end-to-end scenario being measured)\n- Add ClobberMemory() to BM_VAD_Process and BM_VAD_IsSpeechFrame\n  (prevent optimizer from caching VAD internal state)\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T12:30:51-04:00",
          "tree_id": "123a834bf94c02666d150ad9fa23d58168b0e884",
          "url": "https://github.com/vbomfim/openasr/commit/6ee75a01f996cac48d935b8b878bfe5b425d40e3"
        },
        "date": 1772987671181,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 6.027821117264198,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 6.027556409999779 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 6.031764631362746,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 6.030969728316579 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64",
            "value": 5.319012449680493,
            "unit": "ns/iter",
            "extra": "iterations: 116479614\ncpu: 5.318547715997755 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.792866066102477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.792357951438038 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 6.027821117264199,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6.027556409999779 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_stddev",
            "value": 0.4103740064538839,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.41033524963311047 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_cv",
            "value": 0.07084127300218927,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.07084079628249472 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 20.206236676102,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 20.204936174029015 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 20.23507065336067,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 20.232750295443726 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256",
            "value": 22.66711063987981,
            "unit": "ns/iter",
            "extra": "iterations: 34566650\ncpu: 22.664019741571718 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 21.036139323114156,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21.033902070348155 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 20.23507065336067,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.23275029544373 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_stddev",
            "value": 1.4125361682609847,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.411791812861936 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_cv",
            "value": 0.06714807059244533,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06711982437401202 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 74.09564290651356,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 74.0902874817836 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 74.0246066258252,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 74.00815634129741 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024",
            "value": 82.60749850842535,
            "unit": "ns/iter",
            "extra": "iterations: 9411205\ncpu: 82.59733307265118 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 76.90924934692138,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76.89859229857738 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 74.09564290651358,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.09028748178362 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_stddev",
            "value": 4.93495634917164,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4.9354251274461065 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_cv",
            "value": 0.06416596691655503,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06418095546252815 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 304.6192638635564,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 304.5774983065656 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 299.14356571635,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 299.1170901248445 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096",
            "value": 318.06801464630104,
            "unit": "ns/iter",
            "extra": "iterations: 2344348\ncpu: 318.0385936729532 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 307.27694807540246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 307.2443940347877 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 304.6192638635564,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 304.5774983065656 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_stddev",
            "value": 9.738128970855117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 9.738586845594034 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_cv",
            "value": 0.03169170037599268,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.031696548528372434 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1469.641697222583,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1469.4852355656117 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1473.64758242752,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1473.599186901429 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000",
            "value": 1555.0420002980322,
            "unit": "ns/iter",
            "extra": "iterations: 476449\ncpu: 1554.861766946727 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1499.4437599827118,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1499.3153964712558 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1473.64758242752,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1473.599186901429 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_stddev",
            "value": 48.19113013500114,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48.14852649507346 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_cv",
            "value": 0.03213933821402996,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03211367441993486 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4514.058651970316,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4513.976597155605 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4508.084295307231,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4507.591322598717 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000",
            "value": 4758.09480244385,
            "unit": "ns/iter",
            "extra": "iterations: 155323\ncpu: 4757.631484068685 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4593.412583240465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4593.066467941002 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4514.058651970315,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4513.976597155605 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_stddev",
            "value": 142.65026542458952,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 142.5532403441556 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_cv",
            "value": 0.031055400062485916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.031036616025297784 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.910256882161539,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.909300638125597 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.904885290921628,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.904188499102968 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256",
            "value": 10.901820641145296,
            "unit": "ns/iter",
            "extra": "iterations: 64169812\ncpu: 10.90094884491791 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.905654271409489,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.904812660715493 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.904885290921628,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.90418849910297 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_stddev",
            "value": 0.0042703675305649615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.004210735771767392 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_cv",
            "value": 0.00039157371252454375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0003861355442571276 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 67.4359663648598,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 67.43023711207991 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 67.50938836595516,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 67.50151442401281 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024",
            "value": 54.28063936570928,
            "unit": "ns/iter",
            "extra": "iterations: 10348819\ncpu: 54.27745581404014 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.07533136550807,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.06973578337761 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.4359663648598,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.43023711207991 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_stddev",
            "value": 7.6165151628586685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7.614421212949069 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_cv",
            "value": 0.12075267775800638,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.12073019045302379 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 249.25127741760656,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 249.22781487744044 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 249.31142970177925,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 249.2854771970069 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096",
            "value": 177.47169491410676,
            "unit": "ns/iter",
            "extra": "iterations: 2813293\ncpu: 177.46603855339657 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 225.34480067783088,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 225.32644354261467 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 249.25127741760662,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 249.22781487744047 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_stddev",
            "value": 41.459336658621005,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41.44833658344743 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_cv",
            "value": 0.18398177607787033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.18394794650725735 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1383.6408719647422,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1383.5414396748708 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1382.1479683410635,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1382.022178646827 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000",
            "value": 1290.231717441638,
            "unit": "ns/iter",
            "extra": "iterations: 505892\ncpu: 1290.114044104278 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1352.0068525824809,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1351.892554141992 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1382.1479683410635,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1382.0221786468271 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_stddev",
            "value": 53.50404360008768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.50715153489037 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_cv",
            "value": 0.03957379616670515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03957944096293203 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1399.607624973715,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1399.4778803733475 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1399.6750172567015,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1399.6127269635151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000",
            "value": 1402.2772561299075,
            "unit": "ns/iter",
            "extra": "iterations: 499805\ncpu: 1402.1955942817685 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1400.519966120108,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1400.4287338728773 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1399.6750172567017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1399.6127269635151 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_stddev",
            "value": 1.5222307852389043,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.5316307256183475 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_cv",
            "value": 0.0010869040228365858,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010936870178196302 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.155596893827944,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15558046840184175 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.15551146771801908,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15550110563616046 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio",
            "value": 0.15568238295158646,
            "unit": "ns/iter",
            "extra": "iterations: 4491085926\ncpu: 0.15566849321510817 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1555969148325165,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1555833557510368 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15559689382794398,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15558046840184173 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_stddev",
            "value": 0.00008545761876988473,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0000837311351058542 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_cv",
            "value": 0.0005492243780146332,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0005381754025143929 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.96549771422565,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.94401401352764 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.5850897741572,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.5618344559454 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600",
            "value": 324.559102652329,
            "unit": "ns/iter",
            "extra": "iterations: 2157915\ncpu: 324.5371958580392 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 324.7032300469039,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.68101477583735 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 324.5850897741572,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.5618344559454 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_stddev",
            "value": 0.22750182328842283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.22809694080143686 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_cv",
            "value": 0.0007006453962763469,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007025262655376294 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1652.113509828152,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1652.066039293772 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1651.7841956761843,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1651.69272017817 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000",
            "value": 1647.4910801068256,
            "unit": "ns/iter",
            "extra": "iterations: 423884\ncpu: 1647.4324508592028 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1650.462928537054,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1650.3970701103817 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1651.7841956761843,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1651.6927201781702 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_stddev",
            "value": 2.5789579818270845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.5742119706026028 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_cv",
            "value": 0.0015625664395340494,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0015597531147037449 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3278.3736951396004,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3278.236138128871 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3278.990587661744,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3278.7371154558246 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000",
            "value": 3279.118512025587,
            "unit": "ns/iter",
            "extra": "iterations: 213337\ncpu: 3279.0026062052034 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3278.8275982756436,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3278.658619929967 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3278.9905876617445,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3278.7371154558246 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_stddev",
            "value": 0.3982614761834184,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.3892165047742675 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_cv",
            "value": 0.00012146459801450573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0001187121167200327 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.41143007083366,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.40252469663182 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.27948774749922,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.27465527110382 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600",
            "value": 152.3902531761965,
            "unit": "ns/iter",
            "extra": "iterations: 4599919\ncpu: 152.38668398291261 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 152.36039033150976,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.3546213168827 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 152.3902531761965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.38668398291261 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_stddev",
            "value": 0.0708592710298642,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.06970407747524868 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_cv",
            "value": 0.00046507672286535045,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0004575120654218358 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 792.1061503184615,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 792.0383184713394 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 791.949543949067,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 791.9213214437331 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000",
            "value": 793.4304736022906,
            "unit": "ns/iter",
            "extra": "iterations: 883125\ncpu: 793.4013814578833 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 792.4953892899397,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 792.4536737909852 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 792.1061503184615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 792.0383184713393 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_stddev",
            "value": 0.8135836724569754,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.822821027069459 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_cv",
            "value": 0.0010266099758459548,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010383206669144465 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1578.8445831915694,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1578.7291697178694 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1577.946605890322,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1577.883031817457 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000",
            "value": 1580.121134351635,
            "unit": "ns/iter",
            "extra": "iterations: 443813\ncpu: 1580.0232552899604 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1578.9707744778418,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1578.8784856084287 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1578.8445831915697,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1578.7291697178696 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_stddev",
            "value": 1.0927427362728068,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1.0778963560553776 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_cv",
            "value": 0.0006920601406534403,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006826974753791802 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 756844.6836402924,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 756808.3791982733 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 757552.1050920676,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 757542.1213434464 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800",
            "value": 757023.5005417156,
            "unit": "ns/iter",
            "extra": "iterations: 923\ncpu: 756962.2199349934 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 757140.0964246918,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757104.2401589043 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757023.5005417158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 756962.2199349934 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_stddev",
            "value": 367.84130758737683,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 386.93887347379615 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_cv",
            "value": 0.00048582991354488873,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0005110774090930777 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2571304.044117644,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2571183.7830882478 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2571904.2058824264,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2571749.1397058996 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000",
            "value": 2572792.551470575,
            "unit": "ns/iter",
            "extra": "iterations: 272\ncpu: 2572650.198529428 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2572000.2671568817,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571861.040441192 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2571904.2058824264,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571749.1397058996 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_stddev",
            "value": 748.8887524587348,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 739.584270594893 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_cv",
            "value": 0.0002911697801985708,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00028756774140021983 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7751283.822222237,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7750977.411111156 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7751473.844444629,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7750946.711111103 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000",
            "value": 7764893.933333243,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7764751.577777753 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7755883.8666667035,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7755558.56666667 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7751473.84444463,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7750977.411111156 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_stddev",
            "value": 7803.525044770995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7961.395957715413 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_cv",
            "value": 0.0010061425852840634,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0010265406275098523 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 805.9778291535389,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 805.9395957784938 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 806.3032558899528,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 806.2012338618036 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200",
            "value": 862.699265459803,
            "unit": "ns/iter",
            "extra": "iterations: 868979\ncpu: 862.6837023679569 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 824.9934501677648,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 824.9415106694181 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 806.3032558899528,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 806.2012338618036 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_stddev",
            "value": 32.654599304972045,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32.6859585950695 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_cv",
            "value": 0.039581646737112446,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03962215281001646 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2299.731618673884,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2299.574509475317 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2298.888550426075,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2298.7979146745124 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000",
            "value": 2370.0443386337374,
            "unit": "ns/iter",
            "extra": "iterations: 304317\ncpu: 2369.946805469304 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2322.8881692445652,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2322.7730765397105 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2299.731618673884,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2299.574509475317 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_stddev",
            "value": 40.840616114523264,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 40.855492907497414 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_cv",
            "value": 0.01758182621757688,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.017589102146973734 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4719.9783859241525,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4719.703641010786 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4719.27643087892,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4719.1626282176485 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000",
            "value": 4619.177350067144,
            "unit": "ns/iter",
            "extra": "iterations: 148283\ncpu: 4618.790447994729 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4686.144055623406,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4685.88557240772 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4719.27643087892,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4719.1626282176485 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_stddev",
            "value": 57.995930245276895,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 58.10671186453944 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_cv",
            "value": 0.012376045114464926,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.012400369357436703 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1536345.5428571142,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1536304.0835164913 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1536015.1912088045,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1535956.6703296748 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600",
            "value": 1535748.318681309,
            "unit": "ns/iter",
            "extra": "iterations: 455\ncpu: 1535580.2197802234 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1536036.3509157423,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535946.9912087966 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536015.1912088047,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535956.670329675 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_stddev",
            "value": 299.17382760473396,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 362.0289236162716 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_cv",
            "value": 0.0001947700179272286,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00023570404817900212 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3867843.1049723104,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3867608.0994475144 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3868994.2651933944,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3868669.9889502823 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000",
            "value": 3872824.629834169,
            "unit": "ns/iter",
            "extra": "iterations: 181\ncpu: 3872562.7569060926 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3869887.333333291,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3869613.615101296 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3868994.265193395,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3868669.9889502823 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_stddev",
            "value": 2608.0788931784828,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2608.6357297830004 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_cv",
            "value": 0.0006739418149757963,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0006741333862385414 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7763463.044444544,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7763157.822222173 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7761523.866666822,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7760841.73333334 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000",
            "value": 7760885.4666667385,
            "unit": "ns/iter",
            "extra": "iterations: 90\ncpu: 7760741.100000009 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7761957.4592593685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7761580.218518507 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7761523.866666823,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7760841.733333339 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_stddev",
            "value": 1342.3780019057622,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1367.1711106378516 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_cv",
            "value": 0.0001729432310021768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00017614597442101946 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15560029880266743,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15558994489902764 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15553678872912072,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15552042815401193 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady",
            "value": 0.15581447358387815,
            "unit": "ns/iter",
            "extra": "iterations: 4490673433\ncpu: 0.15580504203633114 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15565052037188873,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1556384716964569 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15560029880266743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15558994489902764 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_stddev",
            "value": 0.00014549527194999504,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00014838262382892975 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_cv",
            "value": 0.0009347560907754743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0009533801136156213 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 16098.097873218965,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 16096.09693257167 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 16047.20317984718,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 16046.715373849884 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000",
            "value": 15829.29146305065,
            "unit": "ns/iter",
            "extra": "iterations: 43587\ncpu: 15829.094821850404 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 15991.530838705597,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15990.635709423985 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 16047.20317984718,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16046.715373849884 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_stddev",
            "value": 142.78928080606383,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 142.0606502661515 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_cv",
            "value": 0.008929056401558466,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.008883990158216719 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33347.28060738803,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33346.29931454668 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33317.2630426502,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33314.551218583045 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000",
            "value": 33368.43354912423,
            "unit": "ns/iter",
            "extra": "iterations: 21008\ncpu: 33365.85034272669 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33344.32573305416,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33342.233625285466 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33347.28060738803,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33346.29931454668 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_stddev",
            "value": 25.712908140600586,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 25.89010248219248 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_cv",
            "value": 0.0007711329461705515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0007764957433013253 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67399.37278163638,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67393.96778549299 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67426.4229359586,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67425.5161072532 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000",
            "value": 67184.43393132706,
            "unit": "ns/iter",
            "extra": "iterations: 10368\ncpu: 67180.38667052484 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67336.74321630732,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67333.290187757 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67399.37278163637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67393.96778549299 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_stddev",
            "value": 132.59531074760307,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 133.35455874633485 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_cv",
            "value": 0.0019691375676079877,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.0019805145177738885 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24408.40341701529,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24406.882461645586 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24401.76021617943,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24400.126220362738 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle",
            "value": 24539.13668061359,
            "unit": "ns/iter",
            "extra": "iterations: 28680\ncpu: 24538.116178521333 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24449.766771269427,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24448.374953509887 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24408.403417015288,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24406.882461645582 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_stddev",
            "value": 77.46785495683005,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77.79156316091644 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_cv",
            "value": 0.003168449649501827,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.003181870505047553 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.7946377515596,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.75998368208883 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.77815537817213,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.7589149980714 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480",
            "value": 406.82041227143213,
            "unit": "ns/iter",
            "extra": "iterations: 1720808\ncpu: 406.80327322978115 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.79773513372123,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7740573033138 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.7946377515596,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7599836820887 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_stddev",
            "value": 0.02129804220840693,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.025307376682975845 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_cv",
            "value": 0.00005235536083160813,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00006221482473771731 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.5131243937738,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.4064299678746 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.2887082474224,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.2317361026976 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600",
            "value": 1326.287834929677,
            "unit": "ns/iter",
            "extra": "iterations: 527872\ncpu: 1326.2247173557334 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.3632225236245,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.2876278087685 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.2887082474224,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.2317361026978 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_stddev",
            "value": 0.12981956171334558,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.10294552139664415 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_cv",
            "value": 0.00009787632792346464,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00007761930311204515 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13520.273068078312,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13518.807706429014 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13515.310653345887,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13514.352393282898 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000",
            "value": 13516.451931437907,
            "unit": "ns/iter",
            "extra": "iterations: 51749\ncpu: 13515.86308914187 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13517.3452176207,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13516.34106295126 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13516.451931437907,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13515.863089141872 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_stddev",
            "value": 2.5990113842248164,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2.2657886122241444 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_cv",
            "value": 0.00019227232436416905,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00016763328194157118 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.3557460243284,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.342596479257 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.29149445228614,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.2816205367215 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480",
            "value": 406.39013374809394,
            "unit": "ns/iter",
            "extra": "iterations: 1722417\ncpu: 406.34944963966825 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.34579140823615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.32455555188227 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.3557460243284,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.342596479257 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_stddev",
            "value": 0.05006743960307456,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.03734036806318137 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_cv",
            "value": 0.0001232138751322127,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.00009189788693047251 ns\nthreads: 1"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "distinct": true,
          "id": "46cc2017796eae51b35d7bcf1bc15dfb58f30552",
          "message": "fix: filter stddev/cv aggregates from benchmark CI to prevent false positives\n\nThe _stddev and _cv statistical aggregates cause false positive regression\nalerts on shared CI runners — their ratios can be 40-50x between runs due\nto scheduling jitter, even when actual benchmark times are stable. Filter\nthem from the JSON output before comparison. Only mean/median values are\nused for regression detection.\n\nAlso adds --benchmark_report_aggregates_only=true to reduce output noise.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T13:04:01-04:00",
          "tree_id": "8c8951c5d91aae4a45e46cd93c75cf23b1fe2111",
          "url": "https://github.com/vbomfim/openasr/commit/46cc2017796eae51b35d7bcf1bc15dfb58f30552"
        },
        "date": 1772989640949,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.815412074132581,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.814921321235979 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 6.023128452202768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6.022441672642366 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 21.213047002454733,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21.21168143160863 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 20.44671005622447,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.445075069805075 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 81.9605712459471,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 81.9554274384066 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 80.3393243593793,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 80.3325157520083 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 322.4679285651867,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 322.4460641969154 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 320.2861503835372,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 320.26264448153375 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1505.1026637272887,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1504.9731424155143 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1479.210512868143,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1479.0302720600027 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4750.9030861591755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4750.599096232892 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4696.5479333693775,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4696.1860536768 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.896404158484467,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.895791046332631 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.896842475014582,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.895884790570705 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.02761254006188,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.02480174762844 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.39702043681304,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.39342691155231 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 224.8505637022108,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 224.83839726966167 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 248.69612116765657,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 248.6837053355633 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1351.9141224717775,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1351.8123046157098 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1383.9244566785221,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1383.8133598390662 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1408.3148729802072,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.2432342463514 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1406.5199871946568,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1406.473932284746 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15566847761191147,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15566034786524763 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15566750131561577,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15565987610487678 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 324.63516580162826,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.6243377414126 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 324.6447594639175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 324.63925125861846 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1649.9028126763149,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1649.806760700162 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1649.9934731264802,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1649.8328234090632 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3280.156847309158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3280.020240075601 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3280.4932546098357,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3280.374606967967 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 152.29199258983454,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.28640619482042 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 152.26545348133655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152.2594682133998 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 798.0797930345269,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 798.0377599012327 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 798.4818431242502,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 798.4287295419437 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1583.7798826319056,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1583.6964908999578 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1582.984571496844,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1582.8957184607943 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 767331.5176684983,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 767287.3992714057 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 763416.2480874326,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 763366.8939890768 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2600372.1913580364,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2600285.6444444573 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2590830.3185184845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2590785.7481481633 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7845180.220973848,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7844731.224719115 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7832472.303370811,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7831833.6179775195 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 825.8925297779191,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 825.8476848932293 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 807.1301456406615,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 807.0863464167473 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2339.4535143569624,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2339.3099483639894 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2319.5055702111104,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2319.359967868 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4686.5425529288605,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4686.352913583422 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4714.887453961407,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4714.650753785795 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1541241.9933920924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1541176.3325991177 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1541302.3193832962,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1541238.6453744445 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3886064.162962975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3885916.5222222167 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3884794.8277776823,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3884684.333333313 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7803317.159259341,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7802852.470370371 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7802253.688889019,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7801761.133333369 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15564855997155283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15563836503099182 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.1556563775703492,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15564522773442974 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 19361.82620167897,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19360.53129439971 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 19364.86177691657,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19363.866565180928 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 41956.41106316611,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41953.202804746514 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 41956.87726237479,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 41952.930121059595 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 85351.73167239434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85344.67337587998 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 85337.22324496848,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85334.0478645072 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24404.48950464717,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24402.727654587652 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24366.222543251697,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24363.775402931216 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.732270922975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7043243134356 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.73407343029925,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.70257525390485 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.4211490751675,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.3325112032592 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.485327630206,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.3636675336363 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13512.50146763475,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13511.678999948468 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13512.282712806833,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13511.33010196186 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.2811531320738,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.23844094711677 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.2313373715654,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.1954192297405 ns\nthreads: 1"
          }
        ]
      },
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
          "id": "abd388dae8d71063369525cc22da4139baea9d3b",
          "message": "feat: add session lifecycle and end-to-end pipeline benchmarks (#89) (#92)\n\n* feat: add session lifecycle and end-to-end pipeline benchmarks (#89)\n\nPR 4/4 of benchmark suite. Adds:\n- benchmarks/bench_session.cpp: create, destroy, lookup, ingest+window cycle\n- benchmarks/bench_pipeline_e2e.cpp: full pipeline macro-benchmark, multi-session scaling\n\nCompletes the benchmark suite for issue #89.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: pre-generate session IDs outside timed loops (#89)\n\nMove string allocation (std::to_string + concatenation) out of benchmark\ntimed loops into pre-generated ID vectors. Eliminates heap allocation\nnoise from session lifecycle measurements.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T13:12:05-04:00",
          "tree_id": "9cda633d0cc7e9e6b3c6592fd48c1c607db8b2ae",
          "url": "https://github.com/vbomfim/openasr/commit/abd388dae8d71063369525cc22da4139baea9d3b"
        },
        "date": 1772990157993,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.655372796831798,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.6550581563534275 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.877652453292719,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.877393673021913 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 20.265533700202145,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.26469568192188 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 19.32680954467744,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19.325833899345255 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 76.71057747830808,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76.70609757313066 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 74.31468691117801,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.31192015485892 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 301.9229384828884,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 301.90671660556694 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 294.7195790944029,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 294.70748465711057 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1502.9888803879358,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1502.871508262465 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1477.9086525728346,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1477.7498833460152 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4579.055675252536,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4578.806515097918 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4505.099032060828,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4504.944091069871 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.908151105428649,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.90770438059762 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.900230448230744,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.899837452779797 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.073126917705345,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.07051096951037 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.50061769552832,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.4968032749007 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 224.28652241944772,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 224.27265668412937 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 247.66451418058315,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 247.6405020549998 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1346.9489488782324,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1346.904377072645 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1373.9620586948015,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1373.931969142749 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1406.9445102800457,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1406.868423243838 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1401.66308090445,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1401.5755038418874 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1556643366275988,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15565561970302424 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15565545460667737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1556497197859233 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 326.49959894067405,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 326.48377303680707 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 326.5032129844316,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 326.48840955637735 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1656.157004425143,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.0441143648493 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1656.6383964378463,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.5465659077388 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3300.8860780399805,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3300.7402788198638 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3303.5629043446675,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3303.4164413426283 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 151.94096322289977,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 151.92835356782447 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 151.94397780090384,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 151.92806406930137 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 789.0778500425521,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 789.0414606934451 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 787.8259201629743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 787.7823702592601 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1579.1221730122322,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1579.0315028856342 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1578.1950197875442,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1578.0927532588312 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 757115.0140388705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757084.8412527008 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757171.3660906958,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757135.1263498924 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2571921.0367645957,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571820.822303927 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2572226.408088048,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2572163.76470588 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7754423.596296393,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7754021.596296291 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7755167.755555526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7754847.66666668 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 825.1343170865499,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 825.1038714151433 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 806.7544320072778,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 806.7179857554688 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2323.478111267084,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2323.4004919579947 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2303.3348175381384,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2303.279074356025 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4653.037690889169,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4652.887802229426 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4615.718162454056,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4615.594228321542 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1535961.9517543681,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535905.2726608145 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536028.9122806413,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535979.2938596432 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3873697.141804859,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3873479.681399643 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3872675.1381213013,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3872400.7624309566 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7768220.262963049,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7767719.67407407 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7767187.755555622,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7767033.677777766 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15561010153866933,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15560179541820146 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15565366382942708,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15564698600716995 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 17682.96973521259,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17682.058808682483 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 16032.519090450574,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16031.544513789902 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 34037.9472325246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34036.12896108156 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33150.3317684614,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33148.71949673726 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67010.61278231752,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67004.73807464336 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 66999.56290245174,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 66995.30485343655 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24385.17317163781,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24383.98862791552 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24399.001393921677,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24398.154098132287 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.47480300604644,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.45941332615007 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.4728533872638,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.4666341149646 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.2127418877315,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.1573263739692 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.1783427427388,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.0968093830334 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13509.191972379755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13508.489378801312 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13509.651043474509,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13508.682096979532 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.2031123775837,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.19021624611815 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.22035301295756,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.20707221690304 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35006.896268184064,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35005.23416225572 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35002.0749026262,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35001.35014481206 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 35271.34279102434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35269.137488680884 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 35266.89646845577,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35265.80304859655 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 35435.06657551228,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35431.90168970819 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 35426.35195219575,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35424.25811515687 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 4893845.918414942,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4893509.75524474 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 4893379.314685214,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4892919.335664312 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 10975369.588541877,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10974455.671875013 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 10962120.937500153,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10961740.234374905 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 23176825.01111196,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 23174133.955555633 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 23150885.800000276,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 23148642.133333415 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 155476.2247260233,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 155457.90751792194 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 155984.59421270364,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 155963.8723216974 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 32645.310901770124,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32642.140107882875 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 32642.01711514132,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32636.680921512878 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 66792.12522264506,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 66786.82763994888 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 66816.94074427383,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 66810.14656488544 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 134272.8833301261,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 134263.2247450454 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 134295.8248989772,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 134279.64922070483 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 32634.262223050904,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32632.092396788972 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 32612.5415715681,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 32610.3757510826 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 167184.39407727032,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 167175.73770753606 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 167438.52394635967,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 167429.74784482832 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 336259.70315010444,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 336243.1350048205 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 336239.4541947988,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 336234.11137897865 ns\nthreads: 1"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "committer": {
            "email": "vbomfim@gmail.com",
            "name": "Vinicius Bomfim",
            "username": "vbomfim"
          },
          "distinct": true,
          "id": "0a2904acff457448cabd68f7763515ad2e53dedc",
          "message": "ci: raise benchmark alert threshold to 120% during baseline stabilization\n\nWith only 3 baseline data points on shared CI runners, 115% is too tight —\nBM_SessionManager_CreateMany/5 triggered a false positive at exactly 1.15x.\nSession creation benchmarks allocate ~2MB ring buffers per session, making\nthem sensitive to memory allocator variability on shared runners.\n\nRaise to 120% until we have 10+ data points, then tighten back to 115%.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T13:40:37-04:00",
          "tree_id": "d88aeac54181cfaeccd50bd49d0014f4e4ed3ef3",
          "url": "https://github.com/vbomfim/openasr/commit/0a2904acff457448cabd68f7763515ad2e53dedc"
        },
        "date": 1772991885296,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.850518376499077,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.850213976257503 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 6.036248344374755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6.035916857695369 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 20.985671102853065,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.983847178826874 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 20.61862764962282,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20.617430172146765 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 77.41999418192685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77.41135523913573 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 74.06009794016057,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.04876095574251 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 300.6084299186727,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 300.5793841521145 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 293.68273636756896,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 293.6560669585764 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1492.7398795511683,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1492.6358324866221 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1461.2180497656466,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1461.0353694791374 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4564.611393241574,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4564.3430572433645 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4476.291416693257,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4475.951487048292 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.918118461337984,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.917528926007103 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.907511767078729,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.907058063262559 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 63.08116885280307,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 63.076544602517004 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 67.51091285659635,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67.50495173240374 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 275.4878855157203,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 275.46732170050376 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 292.74411654149026,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 292.7091288940164 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1368.7838782623494,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1368.7192311590518 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1408.572605409848,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.5279827792085 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1403.3980247643033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1403.3182103933384 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1400.1442370442871,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1400.105162741408 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1559727589373266,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15596609987524354 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15589709712175617,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1558907225064863 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 327.5063781789327,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.48692199310295 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 326.6578164919033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 326.64051049718614 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1659.5847006334195,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1659.4607352535277 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1660.3699030254784,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1660.2944494140468 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3302.7094213800938,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3302.3916543654645 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3300.8891288865857,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3300.7858601483717 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 155.29928149462805,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 155.28641738947348 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 155.23209782753995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 155.2171204408594 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 789.3625339341266,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 789.2968036324372 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 788.7205408176237,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 788.6974056402267 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1583.4580083117905,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1583.3095665702012 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1583.4144416858105,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1583.2982584946 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 757620.3462922989,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757562.7915766728 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757709.7429805432,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757660.4762418997 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2572604.4877451113,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2572386.1629902003 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2571932.801470546,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571665.6029411783 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7758334.592592451,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7757715.6962962905 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7759431.055555095,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7759027.266666626 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 824.0604650539649,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 823.9973315571765 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 805.1167243725148,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 805.0638646294473 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2322.926381304353,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2322.7673679957675 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2302.826631841806,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2302.5851739379573 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4653.879794152812,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4653.578233357991 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4619.025273260081,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4618.618208100125 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1535753.021339206,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535647.5717439272 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1535730.5496688439,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1535659.5894039776 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3869690.270718261,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3869411.9926335197 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3869608.6077347067,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3869275.690607726 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7841458.896296074,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7840761.125925892 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7779649.622221995,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7779326.322222207 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15560882015870686,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15559704629361776 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15560737323225265,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15559240694213344 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 17535.19640986301,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17533.408535307673 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 15912.947381900472,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15911.489348327128 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 34083.84307215565,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34080.88063618547 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33215.6864921275,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33213.54686017798 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 66970.29025552211,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 66964.05906808715 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 66923.4681953342,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 66917.4767341469 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24456.54396642248,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24454.50698379398 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24493.05659321568,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24491.276320392095 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.6421677543655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6104754504259 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.57506798471655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.5386192198443 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.397579028662,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.3004066327092 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.0267517203422,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.905279276508 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13508.363117393803,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13507.300540651735 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13507.885305972888,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13506.78721721864 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.23424048256453,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.1992882486515 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.20030354384477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.17886916852837 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35366.06246750916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35363.11213965882 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35291.75222619068,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35290.95160235468 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 40233.52463159356,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 40229.04934856467 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 42105.39700835029,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42100.348291583134 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 42367.61744261259,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42329.74133123212 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 42319.749211931754,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42318.1048739094 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 4912268.111888197,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4911657.720279702 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 4913799.930070137,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4913095.916083858 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 10814907.135417033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10813780.536458392 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 10812366.671875572,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10811861.92187511 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 23059553.044444352,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 23056073.011111286 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 23067384.033333838,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 23061887.733333703 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 179445.93908929863,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179425.4795533409 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 179356.94999992687,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179347.39948474956 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 35713.05588689989,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35707.55703386536 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 35711.74445633866,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35703.43518376909 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 76378.51925747281,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76372.55020828803 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 76384.50142512204,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76381.79412409656 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 153453.019026713,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153444.84705451955 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 153432.63754117343,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153422.2814489588 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 35262.083274535784,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35260.124685011746 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 35279.27230118101,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35276.22341497843 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 180225.01887613084,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 180046.57967988888 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 180232.86638830902,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179725.34264091784 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 353147.9808785504,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 353118.52782084583 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 361931.88113693445,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 361909.1927648626 ns\nthreads: 1"
          }
        ]
      },
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
          "id": "63cb15803fa59960fbc764e33edac32c15d54255",
          "message": "feat: add result aggregator, inference pool, and object pool benchmarks (#89) (#93)\n\n* feat: add result aggregator, inference pool, and object pool benchmarks (#89)\n\nPR 3/4 of benchmark suite. Adds:\n- benchmarks/bench_result_aggregator.cpp: dedup, transcript build, segment filtering\n- benchmarks/bench_inference_pool.cpp: submit, drain, contention with MockBackend\n- benchmarks/bench_object_pool.cpp: checkout/checkin, multi-thread contention\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n* fix: address code review findings on processing benchmarks (#89)\n\n- Wrap InferencePool construction/shutdown with PauseTiming in Submit\n  and SubmitAndDrain benchmarks (isolate queue push from thread lifecycle)\n- Rename BM_FullTranscript → BM_IncrementalTranscript (reflects cached\n  O(1) append behavior, not full rebuild)\n- Fix SetBytesProcessed to report incremental append size\n- Pre-allocate job for QueueContention (remove 6.4KB copy from timed loop)\n- Save end_ms before std::move(seg) to avoid reading moved-from object\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\n---------\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-03-08T13:54:23-04:00",
          "tree_id": "a351aa97f59f8920f8f89786612c5611b10d95f3",
          "url": "https://github.com/vbomfim/openasr/commit/63cb15803fa59960fbc764e33edac32c15d54255"
        },
        "date": 1772993276205,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.444921926640169,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.444457189286973 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.409439862864102,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.408882365003777 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 18.082365093237986,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 18.079711241070733 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 18.07835496581414,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 18.075279826589114 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 77.00501201482125,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76.99759551242572 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 74.93795735475798,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.92667198990998 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 298.4364373646505,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 298.41894933983366 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 290.4833173802679,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 290.48422265640426 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1566.6532619572083,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1566.5434321859611 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1566.8746662658111,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1566.7623879887094 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4828.521969864064,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4828.350704212407 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4829.455513265953,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4829.254592090031 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.90634784084211,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.905854575450675 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.907295164162335,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.906354699033088 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.53447694578174,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.53133405930001 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.17279244039448,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.170414230857546 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 198.8834767986231,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 198.87623258124816 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 173.5947952519617,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 173.58946214501452 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1271.7977433849287,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1271.697905868469 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1272.2060799709434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1272.1287468796838 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1408.1450512402862,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.0564293326368 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1408.1832525687216,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.0739368226366 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15592352724095762,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1559119231352569 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15569682697310924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15569801067991945 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 327.80681072101237,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.7873002874064 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 327.6972153912713,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.68412649016767 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1656.6891008936102,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.6057865127752 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1657.3532579339924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1657.239573758382 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3318.652028570907,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3318.502613098542 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3318.4469038932943,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3318.4780381125033 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 162.49515184678737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.47927114471491 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.48368266168868,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.46934976247306 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 880.5333215187417,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 880.4897456409755 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 881.4654354530321,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 881.4062156404416 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1785.3036428356345,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1785.2408903574296 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1785.3424663831022,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1785.2976727320868 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 757446.1452432867,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757420.9164851113 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757333.6350762552,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757324.996732026 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2572081.066176435,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571913.362745093 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2571928.7316175946,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571616.400735287 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7750194.22962952,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7749656.918518503 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7747413.888888686,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7746909.399999977 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 862.4703906396016,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 862.4193922381008 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 861.1728704838087,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 861.1018781972753 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2370.761300556873,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2370.60309615458 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2371.7740748535193,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2371.462647911411 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4713.0061600813,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4712.715666803565 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4712.8932117923605,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4712.880238593766 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1536794.4493391989,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536613.378854624 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536568.2312775443,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536271.0660792983 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3883379.464088395,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3883216.4585635234 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3871738.6022099964,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3871562.3425414492 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7773420.459259298,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7772998.277777795 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7764438.022222306,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7764268.011111143 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.1557800111908604,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1557702750628234 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15575255780897812,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1557311436317502 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 16006.551856112359,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16005.262586286195 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 16003.026115967737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16002.640911182474 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33432.29319396736,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33431.23305651031 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33444.9365693017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33444.77820733093 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67482.07256499837,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67478.79669512356 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67487.65657741747,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67484.88407062367 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24630.071054205764,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24628.77797319629 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24628.91515705836,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24628.159590558833 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.82605839751653,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.8124242507046 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.7295852557107,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.7282942115794 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1325.8091278815089,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.767801022984 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1325.7948310018787,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.7246351284261 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13497.929563071159,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13497.626213155352 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13496.8585862482,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13496.589159692943 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.8639417158336,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.851530341484 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.8616158933721,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.85259153922516 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35297.12389990991,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35294.98391303628 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35296.95941238892,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35294.83441869876 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 36040.80581849021,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36039.583545377456 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 36084.61328244329,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36081.883409669164 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 35989.39989837363,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35988.245511517365 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 35598.30177845409,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35598.20838414644 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5686054.1626016265,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5685790.124661216 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5682051.902438827,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5681843.211382066 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 11867078.056497378,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11865898.468926564 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 11836822.966101557,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11834695.084745811 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 4083674.7898935904,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4083321.926418426 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 1849719.675531867,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1849567.465425523 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 158094.72808778821,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 158078.4055316124 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 158091.63056706576,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 158070.01311319234 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 33877.995224265294,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33876.053355921125 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 33863.25082284382,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33862.626234268835 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 68935.07357475729,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 68933.38607885623 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 68868.54693958133,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 68866.77071442657 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 136262.73519704508,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 136253.00427101544 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 136261.14890312712,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 136250.51815181514 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 33816.83653660399,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33814.29668083185 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 33824.29804906217,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33821.10232760286 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 169254.23468478737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 169247.29958727848 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 169169.00704053792,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 169161.47681476243 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 339382.7834951415,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 339361.1684466001 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 339263.2922330204,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 339244.9529126202 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 370.18304662475225,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.1758926266964 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 370.25124309781404,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.23329697321765 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5265.946659966332,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5265.695590540518 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5264.0148132035965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5263.783179700945 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 10201.712932526365,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10201.38110342185 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 10102.432352941842,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10102.388999423296 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 50796.77286666803,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50792.63703333319 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 50867.93060000331,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50864.537500000035 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 60.965186345551075,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.92718784129784 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 60.7497653429003,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.732778826974815 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 51.67920846545385,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.6695079680642 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 51.68910070559014,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.68655101180594 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 52.864310271750135,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.85614281371329 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 52.75654725518172,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.73971150293112 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.793168614446806,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.786834251916396 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.78302070037153,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.78079538603556 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 414.2875192070209,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 414.2649883169288 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 410.912333295611,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 410.8818867386695 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4522.1580796668595,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4272.047318808327 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4521.6096505404885,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4289.827691660391 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8371.889333928606,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8040.648444929014 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 8379.467132667436,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8037.728102349946 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 50129.35693910296,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48815.150331337325 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 49949.70941485622,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48850.87644929645 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 35828.886559253435,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19879.880432250393 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 35939.49671867465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20140.94872022198 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 104281.19680701078,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36304.69026436565 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 103321.3961866778,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36430.52688600119 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 6824.433083912645,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6788.657786091534 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 6953.256634030388,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6964.566378022892 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 10847.238962969137,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11306.198380235206 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 10809.763211714526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11159.658090641868 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 21253.391666666692,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 22206.785379419016 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 20993.899731824145,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 22219.06519666139 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.35399151144713,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.353317386429858 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.335261647752265,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.334428364499416 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.35924016306168,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.35866123400703 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.346910518116125,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.346781318005338 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.352412357049804,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.35126115612709 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.32149415670681,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.32008125493727 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 320.17943544425026,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 638.0951401366818 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 322.34114477276415,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 641.3717187283233 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 306.77849732528364,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 909.5142363548393 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 296.9316813085666,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 857.8687942645951 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 596.6802549879815,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1773.4203312939865 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 581.6635793276566,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1719.3941530067639 ns\nthreads: 8"
          }
        ]
      },
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
          "id": "a800565f8173d02a5b7eeda62674c5323e7a623a",
          "message": "fix(k8s): add PSS labels, seccomp profile, and GPU network policy (#99)\n\nCloses #95",
          "timestamp": "2026-03-08T14:28:11-04:00",
          "tree_id": "d42df59cf768949e2ecaa1d0dc2046f8770ad33c",
          "url": "https://github.com/vbomfim/openasr/commit/a800565f8173d02a5b7eeda62674c5323e7a623a"
        },
        "date": 1772995285949,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.3521178165809085,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.351449237613139 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.367821772152067,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.367327333717753 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 17.50968299239235,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.506549750378365 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 17.518027946083944,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.514004560088 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 78.18787410175321,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 78.17798992341564 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 73.12317779972965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 73.11145037994156 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 296.0999459845279,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 296.08130644580723 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 288.8395756503743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 288.82739885094327 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1548.2406843186418,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1548.1085258615967 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1548.6807817157587,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1548.5680768430213 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4722.035896118518,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4721.674034307195 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4721.64008546435,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4721.263882784874 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.911715038630808,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.91113509269388 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.904363629744497,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.903695229784645 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.430303395314375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.42737820923036 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.168981058424684,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.16655420908834 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 199.11447607741093,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 199.09747945606156 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 173.62941002243406,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 173.60941123692382 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1273.925131402719,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1273.8459354949866 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1273.7570324102214,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1273.689616639001 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1399.9417671806248,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1399.856447207384 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1398.5931553316402,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1398.518743732446 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15574109757320773,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1557279776647811 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.1557092263781062,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15569630645812862 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 328.1342241174021,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 328.101008008935 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 327.9714222789874,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.9534688331013 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1657.067606260419,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.888491870055 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1656.9898294817042,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.7779665589144 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3307.5259301599035,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3307.272772938266 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3305.4953988021075,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3305.3128436726297 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 162.42668141465484,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.4123364136063 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.46369658680044,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.4475527262321 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 882.428811198547,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 882.3501481165214 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 878.0286244510667,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 877.9462209939405 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1791.9462042655096,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1791.7913630505745 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1792.1888342678656,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1792.019189901929 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 766276.2262295767,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 766209.763934425 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 765798.0196721628,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 765728.6612021825 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2604147.890954218,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2603883.4163568835 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2602147.2639404335,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2601904.691449811 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7845294.153558017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7844543.970037472 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7844164.955056922,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7843374.9101124 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 860.4535104441898,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 860.3690439802373 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 860.5723843064444,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 860.4730166173341 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2369.11366813905,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2368.913670396145 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2368.814516156184,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2368.574204031906 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4736.114795182335,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4735.715310832268 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4732.269512657068,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4731.872085947659 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1556378.3807406423,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1556230.4911111107 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1555990.0088886833,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1555859.742222228 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3928714.4082395197,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3928287.859550568 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3929455.511236105,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3929024.5674157515 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7866344.071969981,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7865635.545454569 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7868281.000000364,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7867520.306818224 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15582079455256345,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15580494162992806 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15567386672795275,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1556636130073559 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 16011.066514233122,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16009.551343317924 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 16020.507785524822,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 16018.4395564196 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33232.728063104725,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33229.37933323834 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33235.97880210924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33231.679186228524 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67116.18262342991,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67108.63369787713 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67109.81005372168,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67106.65493092984 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24516.29933450172,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24513.900221832828 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24516.701856394426,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24513.956602451686 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.66949563535786,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6365753520017 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.6815388705617,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6444888630029 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.0130012228958,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.8675072912577 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.1363216458856,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.9533769483764 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13498.714847514791,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13497.687614861607 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13498.737190113117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13498.107761113488 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.8281742151651,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.80429495668574 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.820461989413,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.79556090658826 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35230.77905594513,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35228.28219554238 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35237.64530065236,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35234.22238408554 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 35460.21273142097,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35457.868306703844 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 35484.49069236356,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35481.468627948554 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 35588.195053599666,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35586.41455220713 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 35585.92625981305,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35584.517650037575 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5725748.424242362,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5725189.900826446 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5718141.603305721,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5717763.305785175 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 11839472.983051129,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11838237.915254312 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 11807949.881354727,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11806678.25423745 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 4316673.367592708,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4316144.357407402 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 2084983.7694445087,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2084700.4277777772 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 153952.72892109494,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153865.27583854564 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 154089.19492180305,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153857.20625561464 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 31988.502902062257,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31983.482214402142 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 32001.77139984771,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31996.74580686457 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 65737.97865508168,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 65731.36393401297 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 65706.56091801653,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 65700.24140536429 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 130909.97124500784,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 130892.23459331381 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 130908.47080838574,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 130898.08383233733 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 31970.27460824243,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31966.408276281974 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 31925.388407118226,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 31921.76435417627 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 160683.35515235225,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 160666.35446332887 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 160684.10427193387,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 160659.3624253569 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 323768.819694858,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 323731.2380952352 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 323670.8381877044,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 323642.8395746613 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 372.1344418043034,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 372.09588731375146 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 370.24121458062865,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.20829482635776 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5281.865048102251,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5281.21117087089 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5278.807393378759,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5278.276001817979 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 10007.784178208656,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10006.805768956136 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 10008.370783949023,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10007.448107953638 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 49590.445747522936,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49585.034062738436 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 49747.82572940621,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49740.66812070978 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 61.168571166898,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 61.15334554624858 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 61.18613482097404,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 61.16794239357114 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 52.670492318699,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.657937556796135 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 52.49491221574846,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.4821347892007 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 53.57879657119304,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.56869038518971 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 53.62491502788556,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.61294597141197 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.83841285205935,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.83446960154624 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.85208389682051,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.84857007766009 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 414.4712712230619,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 414.4388129515132 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 410.8284481298956,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 410.8108635066465 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4512.685435215418,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4153.203368644861 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4535.490116670562,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4154.822503327497 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8240.411790250302,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7894.724409759946 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 8251.48357386662,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7930.752808980821 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 49602.72940671634,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48085.23555865261 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 49572.919409843074,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48168.727216856874 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 37093.957668155446,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20925.383455909887 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 36824.957020743925,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20917.775599259814 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 97600.17719831178,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34724.2172127637 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 97194.45778280299,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34414.978006215926 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 7068.894062985557,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7263.426480145131 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 7160.723747310759,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7258.902983820209 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 11769.386154430302,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11826.937321497577 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 11688.996347776256,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11943.248767181554 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 21109.1311722,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21001.418101659878 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 21236.389393153953,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20822.797614107967 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.346487824113847,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.34551122083091 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.289845689582023,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.289505680804847 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.30565007401354,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.304867877221586 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.291997869196816,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.29097476307439 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.558510816669123,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.55773530426759 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.356313035744957,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.35550227764438 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 313.250246638773,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 625.7954168783305 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 330.4202742891477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 660.3279653125403 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 322.41120358650335,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 932.0177589216596 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 325.8843722752441,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 945.7297228504831 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 652.0972466666799,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1926.7580550000455 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 663.2347549999906,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1964.7022287500704 ns\nthreads: 8"
          }
        ]
      },
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
          "id": "9169be5c68798c8687057b5a257d6c882d334e36",
          "message": "fix(k8s): remove committed secret, disable SA token, add default-deny policy (#100)\n\nCloses #96",
          "timestamp": "2026-03-08T14:38:36-04:00",
          "tree_id": "e4ed3e1918a9518f8a73c3e11c9a62a6b722d2d5",
          "url": "https://github.com/vbomfim/openasr/commit/9169be5c68798c8687057b5a257d6c882d334e36"
        },
        "date": 1772995913435,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.629563149628988,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.6289178227894086 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.6000814585826575,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.599091362943603 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 19.75669772898123,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19.754618546045666 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 19.72280832998214,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19.719864395132614 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 91.52032166210948,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 91.51290271066851 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 87.65063736101865,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 87.64460222869332 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 322.54979597859784,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 322.5264917653647 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 316.7820075706283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 316.77185362856943 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1579.397084244409,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1579.3238977614744 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1581.752629971924,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1581.7215844038053 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4871.976540740768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4871.7095851016675 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4871.943796734437,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4871.579865781171 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.911486806459969,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.91091970999104 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.907863014092614,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.90722021400669 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.462135872699655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.458956195079054 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.190693227959166,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.18742380397498 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 199.14700521800117,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 199.13062774365662 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 173.59287973196263,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 173.57155852061626 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1268.9193333345224,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1268.868044266354 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1268.8861541082272,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1268.806863592619 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1396.091706338548,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1396.0208216113258 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1396.0736082235378,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1396.0518741245896 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1557094059175866,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15570220343660032 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15571691004327637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15570914860404692 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 328.028792340637,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 328.0093713179927 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 327.81853507806136,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.7997101992094 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1666.4699532621573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1666.3856558760708 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1660.6075370460458,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1660.49901440089 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3311.8227041941823,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3311.578612425101 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3309.9720245978865,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3309.7963103121874 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 163.20256763993095,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 163.1934286049706 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.3633395967669,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.36069738072612 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 881.402119175135,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 881.3629711814505 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 877.6362778968324,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 877.6133137034634 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1786.8199828130228,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1786.7294552946794 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1786.052032731841,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1785.9761039583484 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 759316.4355362989,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 759266.9866377759 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 758987.1495125046,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 758925.4897074766 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2569419.9963234584,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2569308.171568625 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2568707.5183824124,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2568624.0624999986 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7748043.481481343,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7747718.859259289 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7746324.0999994315,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7746127.44444446 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 862.5764597831534,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 862.5417948259569 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 863.2027478995923,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 863.1442295956999 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2368.6016052946197,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2368.5339308621974 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2368.3640446926743,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2368.352221609176 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4720.128485126416,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4719.936470143877 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4719.7808122162205,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4719.580955207367 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1536451.7481481032,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536385.9525925934 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536289.086666582,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536280.444444442 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3870897.3443830716,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3870769.605893191 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3870075.7292820234,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3869889.3591160304 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7787372.948147911,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7787096.10740741 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7788760.522222068,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7788476.788888864 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.1628956074819284,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1628785699106789 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.16394815063165688,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.16393805826705318 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 19317.097799195064,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19316.304503157175 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 19328.56569181387,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19328.74177467581 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 42243.866890717465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42241.593590590106 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 42314.2422132887,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42311.607093560735 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 85317.1120045494,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85312.21474983705 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 85316.79714912242,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85310.52546296219 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24503.793413592954,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24502.27635846118 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24502.7175404203,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24500.250122489157 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.6825626769755,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.67031317854065 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.71194260724843,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.70084152956343 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1325.6621319617834,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.589713715571 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1325.668295270564,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.545668791617 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13505.685875052099,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13505.303906626797 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13507.486852512344,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13507.429921867319 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.8831393654839,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.8612923275334 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.8970660980463,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.887615039287 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 42646.478948010634,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42645.05154177819 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 42640.17665365137,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42638.40364901107 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 42909.36415167722,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42907.541244603024 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 42925.540548838464,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42924.920498496176 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 42987.46899438467,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42985.811026033894 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 42979.43032159193,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42978.30928024534 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5701191.9449035665,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5700674.933884303 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5697919.545454629,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5697840.3140496025 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 11661992.56111137,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11660623.949999956 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 11667618.949999793,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11666819.149999933 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 4066491.5763158114,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4066105.4780701767 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 1850613.389473659,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1850472.281578943 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 179945.24003773226,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179919.8681374871 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 179951.09081610854,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179914.26218559945 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 36590.953415123084,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36588.34537544593 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 36492.046306449316,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36490.167214826055 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 77543.04264124324,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77539.73317813943 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 77550.38731848024,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77545.12637179859 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 153648.7970887305,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153641.10299173484 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 153604.67807768885,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153595.18784288043 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 36781.96418159207,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36779.97580869076 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 36497.76613910898,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36495.60422740531 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 181370.49164654312,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 181364.6121175549 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 181390.3919082214,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 181384.4097222242 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 364770.42636063346,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 364756.30394713924 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 364723.2754303875,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 364708.95409494283 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 370.4798010561802,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.461373193342 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 370.38417461464815,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.37950736021367 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5277.472456268492,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5277.2688219897345 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5273.214692504265,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5273.180733342898 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 10003.946678088692,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10003.2369407958 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 10001.760094231897,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10000.879882923982 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 51730.37532127342,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51728.365737070584 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 51735.12625207158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51731.67774014499 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 59.80739604503801,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 59.79686574757725 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 59.78842814011923,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 59.77098988491543 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 51.43501341001581,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.417402490055025 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 51.33164904600042,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.31845416146265 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 56.242127300000284,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.23703750000099 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 56.197813899996156,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.187966600001005 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.67641359737353,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.66883035666728 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.68582685374477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.67079483702181 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 408.4933006719843,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 408.4761066280073 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 408.95566843738925,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 408.9271230689133 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4482.28399604465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4152.749721174752 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4479.743309851562,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4145.106294258565 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8017.371795956584,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7622.582633369926 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 7989.921237068228,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7604.90106344823 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 49763.087812915306,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48478.41235817702 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 49656.6892419389,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 48430.737588278316 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 35021.03618257358,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19594.750410259618 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 35112.9651668642,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19598.824144532206 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 96027.8838175588,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33630.92862647243 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 94787.92963657864,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33541.54617169731 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 6668.208372919558,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6733.009878953942 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 6666.169989707287,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6615.601228491254 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 11398.810842805105,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11436.228266015889 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 11247.562839677279,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11205.671782360383 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 18810.257276968394,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20536.353670290635 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 19049.04912676463,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20845.994824194862 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.61745163196553,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.616698842116858 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.395103706107562,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.395279916262737 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.393137655449074,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.391836975424187 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.37914951889682,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.378121868441422 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.370182891740125,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.367038310093076 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.37623483725292,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.37592711973613 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 312.44180783471774,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 623.5820257103568 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 322.39264484421886,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 643.5718263238307 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 343.0408528660523,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1006.8375446464664 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 347.31922867731146,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1014.9881256077741 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 679.966725833386,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2017.4123591666655 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 675.4210287500939,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2001.1339837500234 ns\nthreads: 8"
          }
        ]
      },
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
          "id": "631ae44af24fc4e884953484cd0b22b179f03b10",
          "message": "fix(k8s): pin images, set explicit UID/GID, add startup probes (#101)\n\nCloses #97",
          "timestamp": "2026-03-08T14:41:48-04:00",
          "tree_id": "ca1a3b4a6feb7bfcad1a2673e83213c7b3804fc7",
          "url": "https://github.com/vbomfim/openasr/commit/631ae44af24fc4e884953484cd0b22b179f03b10"
        },
        "date": 1772995996976,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.3950633661172,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.3946360365549255 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.396355689454808,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.395693547974034 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 17.925389912133017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.923364550649378 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 17.908676987963545,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.90721347380551 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 86.58166168801974,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 86.5708653766252 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 82.23643397373175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 82.22475898811486 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 295.1164672474799,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 295.0895470890966 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 286.97248637273003,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 286.9478508649502 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1566.1806806985003,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1566.0387971462221 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1557.7637565843786,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1557.6726690818587 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4710.826969823197,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4710.359908766561 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4707.7284753093745,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4707.299673654669 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.917851091466758,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.916662655718874 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.915079001997606,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.913545515134595 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.45891002863768,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.45437941669248 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.177388441804595,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.17159940089244 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 199.40683805557103,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 199.3875464964067 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 174.07369545974575,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 174.04867059930265 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1276.5677358769974,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1276.4522722085435 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1276.5208075348473,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1276.3601182238067 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1401.1107555171957,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1400.9890451770736 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1401.296455447881,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1401.129504106311 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15572962650984457,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15571186952186114 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15568938330778428,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15567785533304543 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 327.7630757752354,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.7385701156376 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 327.78016677716556,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.7595388292852 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1673.2139432190872,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1673.0638042109952 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1676.9454806007286,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1676.734870896267 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3302.7110409473935,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3302.4328954016496 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3301.0793071220164,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3300.8522476888907 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 162.74737103755174,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.73450423208683 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.50415269600543,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.49757195806646 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 875.1835538379992,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 875.1187601594737 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 874.0038070320652,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 873.9431618981889 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1790.5218673390393,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1790.3821719941716 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1790.0866782983746,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1789.9219024214517 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 758697.5717893393,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 758609.722582973 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 757782.9458874512,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 757671.886363638 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2572292.545343128,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2572102.2230392066 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2571856.569852822,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2571715.73161763 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7757210.5851850705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7756188.659259251 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7756110.400000201,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7755100.1444443865 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 862.7358450061703,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 862.6413516526305 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 861.2565136220788,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 861.1999997541915 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2370.017588279438,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2369.7487160071464 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2371.1803753610143,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2370.9970996071875 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4727.060488321406,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4726.457652544085 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4725.120710858839,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4724.548962767762 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1544831.7255334926,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1544638.0441501038 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1537884.5143487437,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1537720.2030905087 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3877846.769797471,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3877307.98158378 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3874525.5027624206,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3874228.0718231783 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7777899.6666666,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7776759.9333333075 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7773486.688888751,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7772320.2333332775 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.1556099653488127,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15559149712802758 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15559510943036986,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15557351184645282 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 15905.957557831296,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15903.339173303042 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 15907.638771331447,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15905.223868031695 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33235.57446875968,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33230.9188392009 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33240.311037107975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33236.19091341592 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67203.67252585133,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67194.74161944106 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67210.32993948362,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67199.21832676999 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24527.263973630295,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24523.98929331181 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24533.009257310256,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24527.78788835094 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.77151031054314,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.73582469659823 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.81579499361914,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.78499615639583 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1326.0542924582562,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.8739505665499 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.060739778415,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.8627502968575 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13510.457895756665,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13509.759852741767 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13499.1926952134,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13498.399670606508 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 407.03263490099994,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.9864377858992 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 407.0761276321862,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 407.0402664554311 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35104.80935889705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35101.51942381051 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35104.39294318272,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35100.62366994584 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 35410.567772431634,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35405.610129146815 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 35414.078500885684,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35410.10721701722 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 35460.70143532659,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35456.49810874712 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 35452.19290780127,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35446.36418439726 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5967173.153846178,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5966122.5413105525 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5964871.119658224,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5963946.931623907 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 12343697.222221918,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 12342363.111111179 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 12332140.210526375,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 12330453.1578947 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 4556646.217732835,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4556091.690235677 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 2251381.8451178246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2251076.1111111175 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 158481.3257168003,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 158434.0751131877 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 158409.10769240686,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 158372.66515844179 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 33788.774873822,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33782.03790143709 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 33790.68608351627,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33780.90910406015 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 68886.83244820409,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 68876.13535929687 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 68886.13916207483,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 68874.18872934682 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 136595.91380208076,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 136584.98287760408 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 136621.52109374935,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 136611.33261718694 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 33632.602963319376,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33629.139404132526 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 33635.47107160123,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33633.30456511276 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 168683.31558232816,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 168663.4316465862 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 168733.15036144937,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 168711.77710843325 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 347677.42066602403,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 347636.02775057324 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 347273.8143976535,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 347232.7551420224 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 370.55348205180627,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.5021144297048 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 370.4697971673822,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.41735916933607 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5240.96590070455,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5240.209907888048 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5264.230755861708,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5263.504983413867 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 10007.388454035037,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10005.778348573076 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 9993.878081936884,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 9992.078431092003 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 49665.64937062116,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49659.17740866862 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 49692.0373367388,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49684.360590572665 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 60.871555764704965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.85703287614444 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 60.97552981520801,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.962456157579105 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 52.15908522656898,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.1477816288755 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 52.20292315876019,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.19229525140423 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 53.33393952450465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.321973432775565 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 53.249404294825815,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 53.23072779317845 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.74522125747936,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.73165298495727 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.74808376600433,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.73646497819326 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 413.5240984116569,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 413.07329639395084 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 410.41196018630916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 410.3649795616643 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4597.210441403952,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4260.5494153403115 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4583.613426302173,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4250.603479526028 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8732.870846585298,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8365.70854770852 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 8780.310275386553,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 8370.851514963048 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 51776.49533305459,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50329.53509990534 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 51820.23979981522,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50282.20549974378 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 35734.97883875089,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20147.982539995362 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 35963.8518047443,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19879.971667135123 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 96403.22906791394,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35410.60601481131 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 95755.96462828688,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35341.401856899036 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 6756.361921030937,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6738.974332173625 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 6706.013018517749,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 6786.4700160683715 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 11660.197358333353,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 12791.488399999667 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 11152.030899999942,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 12127.098175000125 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 21106.339622368072,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21042.16519922403 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 21332.58821998515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21266.96805603714 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.42558522772215,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.424093334468303 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.414353734599434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.412887683470025 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.31703707068286,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.315282614837464 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.3505998279725,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.3466342475573 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.323505656268008,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.322033317215933 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.300172732404246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.299477341228563 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 290.93210084011054,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 580.234504562647 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 300.07592919098374,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 599.5170839695742 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 306.25244793093407,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 874.3157118369119 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 302.5375282034283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 878.3943255524064 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 615.7172812500278,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1819.9659462499794 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 629.3556349999818,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1839.6812537499584 ns\nthreads: 8"
          }
        ]
      },
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
          "id": "8d496a3900acbc2ac71c7d57e613053914c218cd",
          "message": "fix(k8s): add quotas, PDB, topology spread, CI scanning, restrict DNS egress (#102)\n\nCloses #98",
          "timestamp": "2026-03-08T14:44:56-04:00",
          "tree_id": "0c2b53d6fd544a31ccf52e0afeb03fac575801cc",
          "url": "https://github.com/vbomfim/openasr/commit/8d496a3900acbc2ac71c7d57e613053914c218cd"
        },
        "date": 1772996175229,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.634930075331965,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.634339510489288 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.653101244805199,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.652850793676431 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 19.33283928160346,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19.331586941027552 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 19.33655257819449,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19.336065915203438 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 80.70797486622148,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 80.7023474079463 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 79.23277695135977,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 79.22760126994542 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 322.10663596494936,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 322.08926085627417 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 317.24521798250845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 317.2200411549081 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1568.7916482794044,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1568.664430332016 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1569.1516750108874,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1569.0017203722975 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4986.95870582923,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4986.672403222357 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4987.809617166712,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4987.654551935561 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.913114404071868,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.912273757272148 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.912814071699652,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.91213595330962 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.44771916565526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.445302627932584 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.18244994640503,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.180478545922 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 199.2011380403026,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 199.18672452327425 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 174.40719580145472,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 174.3931373928419 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1274.5646743756322,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1274.5025746221806 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1273.7159142410733,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1273.6122285907745 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1408.4983676699674,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.3980558238109 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1408.4159443907613,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1408.3185276838874 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.1555808379592694,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15556607307643608 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15556328121378532,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15554942468853386 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 328.2063045454296,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 328.1778557523126 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 328.37644596854415,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 328.3461850867854 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1659.963674504321,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1659.8033698184893 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1660.2862820232192,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1660.0736239815624 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3318.1433119559933,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3317.868653353618 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3318.483620971576,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3318.1475368652414 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 162.36683134891194,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.35451515745248 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.38862057650684,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.37247298163697 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 885.1333419137528,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 885.054006877774 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 884.3800523404552,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 884.3229636695793 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1825.782158144143,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1825.5577335983414 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1823.0219827675894,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1822.8109169805848 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 759895.429909918,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 759822.7001801786 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 758909.4183783737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 758875.1978378365 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2575520.4607842984,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2575183.716911773 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2575047.6397059388,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2574565.6544117793 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7762548.807407602,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7761942.225925919 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7759305.366666543,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7758322.577777774 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 862.7838790404162,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 862.6931511296299 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 863.1773675386404,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 863.0825575088111 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2372.183073689033,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2372.0042793023076 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2373.1781557865643,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2373.0746616669476 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4715.122312045293,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4714.789964519888 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4714.911405281424,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4714.6065817838635 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1538351.2498169441,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1538237.8271062288 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1537915.927472638,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1537817.1868131931 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3882313.581952185,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3881991.992633507 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3880132.4033149094,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3879765.8453038563 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7775502.114814916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7774855.577777795 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7772378.111110988,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7771700.277777743 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.156134817693401,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15611209087546438 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15619979502272616,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1561817670339913 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 19447.141642663573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19445.280004101383 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 19440.667859839996,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19438.44864229984 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 42803.49749979874,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42799.609283006845 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 42836.6323493843,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42835.114384225075 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 85926.34540025324,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85915.78839939515 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 85902.30690882172,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 85890.65320898226 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24819.587420848737,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24817.723820999952 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24818.21126311326,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24816.628189679206 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.6796501933575,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6414418057693 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.6846621232468,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6680917847261 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1325.69100224565,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.5829241091176 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1325.6650367164896,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.550516456137 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13496.898212943312,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13495.541257815496 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13495.971121777686,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13494.006901470746 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.78701320736513,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.75569724872156 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.76445974364265,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.73278332160345 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 42390.467066108955,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42385.99059896317 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 42383.44550021107,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42379.35332566786 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 42414.47060380247,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42411.35295794176 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 42423.699035055884,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42419.577439844245 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 42415.19496360854,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42411.453295429375 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 42429.061513335975,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42426.0162704893 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5737590.945355199,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5737113.795081974 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5731548.762295383,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5731333.327868946 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 11913845.824858591,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11912448.587570643 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 11929024.389830329,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11927942.305084936 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 4208004.121634228,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4207519.969359326 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 1940577.1782730324,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1940366.8022283856 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 180353.49667078597,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 180325.8707307489 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 180331.22619938524,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 180325.06381328226 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 36171.37048380427,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36151.93836517148 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 36358.08528862158,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 36354.25778654476 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 76724.1277528213,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76718.39468974822 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 76720.01062780754,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 76714.78755341396 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 152921.44531704916,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152905.40459569608 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 152908.4866928549,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 152893.75545375256 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 35454.10125130757,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35451.521956895755 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 35441.32783567719,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35440.13604168794 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 179490.23504272685,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179475.54111111176 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 179532.40948716667,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179511.03358974584 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 354108.3443583104,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 354071.3567614127 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 354125.5927648461,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 354097.5545219639 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 382.9945446661115,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 382.9692369328772 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 376.2786116056741,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 376.2563414711155 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5390.56487988147,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5390.174601099959 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5403.053242200211,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5402.717166669271 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 10213.641375583438,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10211.837170228437 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 10264.985630066343,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10264.178747236467 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 49946.52592379829,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49940.266206863365 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 49953.65162727296,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49947.3424814994 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 61.010079184915845,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.998453232013524 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 60.986678795315804,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 60.972366524836616 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 52.37571184955471,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.357650868450186 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 52.356748506920475,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.34197839111431 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 52.97558601785639,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.949956702527494 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 52.82552238497933,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 52.8092457501009 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.70490848476919,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.69664994390166 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.698685776550086,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.695378403093144 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 411.993422942694,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 411.96940160277563 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 407.51400765691614,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 407.50149665126565 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4468.178605668236,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4174.595313402662 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4455.521315835144,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4155.865764722382 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8387.949870389337,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7995.107555538438 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 8379.323516015316,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7987.054877439682 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 52295.1820335341,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50878.40939984477 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 52125.73020003788,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50665.26569992504 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 35540.395386756885,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20604.556197689177 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 35593.75605399947,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20625.31491379831 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 99382.60595361562,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35475.81121191428 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 98500.21444900647,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35525.15262269394 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 6964.027583352039,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7159.292773638334 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 6966.066766388929,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7165.67048618933 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 11640.269852154668,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11505.987478815461 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 11395.133245251718,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11581.396290474113 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 19298.337767413563,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20336.710458949947 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 19111.63679374739,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 19321.150415980264 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.356409685382012,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.354863304359096 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.35998915676151,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.356647084901642 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.37064866091269,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.370271192878267 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.36798478990705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.367524305742446 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.26198259534933,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.261745470851697 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.235833817406593,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.23579742407828 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 316.8940466761573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 632.4548105747768 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 314.6388136792854,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 627.8248123348629 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 331.92085989840297,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 948.9176612222744 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 339.8410084548564,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 971.2953371817504 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 682.8616845828175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2084.351922691146 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 679.3328704441589,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2101.6720495562618 ns\nthreads: 8"
          }
        ]
      },
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
          "id": "3e3aad20f4ddbbe7d0fe122978bf57d7036c4d1b",
          "message": "Merge pull request #110 from vbomfim/craig/test-vulnerability\n\nfeat: add database migration helper",
          "timestamp": "2026-03-14T17:26:43-04:00",
          "tree_id": "bb1da2867ff96ab9283e4da1b7cc2f0dce48297c",
          "url": "https://github.com/vbomfim/openasr/commit/3e3aad20f4ddbbe7d0fe122978bf57d7036c4d1b"
        },
        "date": 1773524397286,
        "tool": "googlecpp",
        "benches": [
          {
            "name": "BM_RingBuffer_Write/64_mean",
            "value": 5.412559856540227,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.412392627411578 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/64_median",
            "value": 5.407882120536616,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5.4076558101823515 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_mean",
            "value": 17.348887789234816,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.34810747813032 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/256_median",
            "value": 17.349350657031724,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.34816826160696 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_mean",
            "value": 74.04744037371704,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 74.03929904110774 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/1024_median",
            "value": 70.88760138510672,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 70.87803057454413 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_mean",
            "value": 296.06562449065586,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 296.0474781440431 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/4096_median",
            "value": 288.5521339499972,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 288.53813231240326 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_mean",
            "value": 1542.6740732927835,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1542.5807448229782 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/16000_median",
            "value": 1539.8482513272172,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1539.8129021200295 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_mean",
            "value": 4673.311922440092,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4673.024108398767 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_Write/48000_median",
            "value": 4671.551880241531,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4671.300004006191 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_mean",
            "value": 10.898319060221155,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.897797091303962 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/256_median",
            "value": 10.897456915694079,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 10.896870753301577 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_mean",
            "value": 56.41150507663513,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.40813411522468 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/1024_median",
            "value": 50.171342473093524,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.16824178937196 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_mean",
            "value": 198.7935336855244,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 198.78517628189272 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/4096_median",
            "value": 173.61235838033087,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 173.6085333350527 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_mean",
            "value": 1273.6751018303646,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1273.6150590661628 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_ExtractWindow/16000_median",
            "value": 1273.4689449979483,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1273.4286229015986 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_mean",
            "value": 1410.1805345842731,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1410.1158171874174 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_WriteWrapAround/16000_median",
            "value": 1410.0685093609573,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1410.0387502041156 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_mean",
            "value": 0.15562249046825297,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15561452607283754 ns\nthreads: 1"
          },
          {
            "name": "BM_RingBuffer_FillRatio_median",
            "value": 0.15560259190194584,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15559756278794087 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_mean",
            "value": 327.9120713900351,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.89420701641836 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/1600_median",
            "value": 327.88294430013457,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 327.87458334602144 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_mean",
            "value": 1656.4620721958865,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.3572724627518 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/8000_median",
            "value": 1656.2020008942343,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1656.1654463688028 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_mean",
            "value": 3303.794010973534,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3303.530174075449 ns\nthreads: 1"
          },
          {
            "name": "BM_PCMBytesToFloat/16000_median",
            "value": 3303.401929731012,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3303.220172486214 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_mean",
            "value": 162.50509731469114,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.4975473175219 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/1600_median",
            "value": 162.40629958395476,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 162.39655223185326 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_mean",
            "value": 877.4138865679006,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 877.3748076625337 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/8000_median",
            "value": 872.8905970794002,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 872.8430376846514 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_mean",
            "value": 1792.6253470554402,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1792.5508838628982 ns\nthreads: 1"
          },
          {
            "name": "BM_PCM_S16LE_ToFloat/16000_median",
            "value": 1789.219401208059,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1789.1408934356607 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_mean",
            "value": 758498.2993492283,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 758457.8503253778 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/4800_median",
            "value": 758500.5563991205,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 758450.6073752687 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_mean",
            "value": 2581217.196801978,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2581074.7146371487 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/16000_median",
            "value": 2581209.099631057,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2581054.1808118066 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_mean",
            "value": 7777197.755555465,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7776660.666666664 ns\nthreads: 1"
          },
          {
            "name": "BM_Resampler_48kTo16k/48000_median",
            "value": 7776728.555555538,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7776173.022222268 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_mean",
            "value": 860.2006231450454,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 860.1594885941473 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/3200_median",
            "value": 860.4699745077327,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 860.4614253519004 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_mean",
            "value": 2366.6981472150433,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2366.5739631697447 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/8000_median",
            "value": 2366.639002830395,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2366.585965636059 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_mean",
            "value": 4722.730021899352,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4722.395152913246 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_16kHz/16000_median",
            "value": 4723.095464540493,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4722.866614054257 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_mean",
            "value": 1537018.229532148,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536899.6527777754 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/9600_median",
            "value": 1536221.131578928,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1536100.824561403 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_mean",
            "value": 3901939.7219152246,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3901735.1491712746 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/24000_median",
            "value": 3875913.7016573655,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3875864.651933711 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_mean",
            "value": 7779726.829629554,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7779377.162962983 ns\nthreads: 1"
          },
          {
            "name": "BM_AudioPipeline_IngestPCM_48kHz/48000_median",
            "value": 7776627.50000003,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7776172.133333385 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_mean",
            "value": 0.15564419704009674,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.1556355785626233 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_WindowReady_median",
            "value": 0.15564925770638946,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 0.15563912770903945 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_mean",
            "value": 15881.225364005875,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15880.385381958635 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/5000_median",
            "value": 15877.834885206992,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 15877.213861883103 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_mean",
            "value": 33131.96979902904,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33129.7421532819 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/10000_median",
            "value": 33139.72017456515,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 33138.05170532675 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_mean",
            "value": 67055.73414305008,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67051.16650600867 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_ExtractFixedWindow/20000_median",
            "value": 67068.56728359495,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 67064.46346635802 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_mean",
            "value": 24610.950451558736,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24609.206885241947 ns\nthreads: 1"
          },
          {
            "name": "BM_BufferEngine_VADFullCycle_median",
            "value": 24609.97332817891,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 24608.504585866267 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_mean",
            "value": 406.706401533922,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6736578254895 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/480_median",
            "value": 406.7028536776517,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.6687267622103 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_mean",
            "value": 1325.9288052729441,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1325.856569133678 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/1600_median",
            "value": 1326.0619753885944,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1326.029000490412 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_mean",
            "value": 13500.20394394437,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13499.558584086733 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_Process/16000_median",
            "value": 13498.158683038788,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 13497.496096535993 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_mean",
            "value": 406.88288172018025,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.8614587269585 ns\nthreads: 1"
          },
          {
            "name": "BM_VAD_IsSpeechFrame/480_median",
            "value": 406.8572061413926,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 406.84296070645723 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_mean",
            "value": 35044.79064684617,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35043.40969684834 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_Create_median",
            "value": 35028.29440913002,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35027.20876920755 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_mean",
            "value": 42016.7790629155,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42014.80862669819 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateDestroy_median",
            "value": 42185.452800646075,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42183.85948785309 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_mean",
            "value": 42224.405781369314,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42222.89416234493 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/1_median",
            "value": 42223.98908454949,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 42222.53546013803 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_mean",
            "value": 5646875.008196705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5646256.57377053 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/5_median",
            "value": 5645751.688524477,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5645056.442622971 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_mean",
            "value": 11678308.938888906,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11677619.43333324 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/10_median",
            "value": 11678898.566666855,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11678199.083333142 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_mean",
            "value": 3990976.889455784,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3990537.390306112 ns\nthreads: 1"
          },
          {
            "name": "BM_SessionManager_CreateMany/20_median",
            "value": 1790854.3418367393,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 1790653.0765306044 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_mean",
            "value": 179033.65285230483,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 179018.1832522763 ns\nthreads: 1"
          },
          {
            "name": "BM_Session_IngestAndWindow_median",
            "value": 178958.43591704918,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 178945.96265028577 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_mean",
            "value": 35623.39555759255,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35621.696752188655 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/5000_median",
            "value": 35622.72592140204,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35620.06673793462 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_mean",
            "value": 77188.91202119381,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77184.40968465955 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/10000_median",
            "value": 77193.77635500507,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 77187.86422342427 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_mean",
            "value": 153031.24152480715,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153020.55427033306 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_WindowCycle/20000_median",
            "value": 153066.948275861,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 153057.712570929 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_mean",
            "value": 35650.829590781635,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35648.668720403155 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/1_median",
            "value": 35648.81964458651,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 35646.49921075436 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_mean",
            "value": 180685.75928319024,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 180675.6256569313 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/5_median",
            "value": 180576.37244765434,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 180561.49004910816 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_mean",
            "value": 362865.259605394,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 362837.60661128326 ns\nthreads: 1"
          },
          {
            "name": "BM_Pipeline_E2E_MultiSession/10_median",
            "value": 362901.3987538952,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 362879.15524402517 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_mean",
            "value": 370.1983938140946,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.1756446896834 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/1_median",
            "value": 370.2325985793322,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 370.2011393706943 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_mean",
            "value": 5206.816285759312,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5206.529179528384 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/5_median",
            "value": 5196.1062134330705,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 5195.731349560959 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_mean",
            "value": 9928.906081078017,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 9928.37997695061 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/10_median",
            "value": 9880.526972095175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 9880.24653174597 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_mean",
            "value": 49285.1413750214,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49282.3251414223 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_AddWindow/50_median",
            "value": 49259.27322019569,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49258.7643827903 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_mean",
            "value": 59.96482632324055,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 59.9512009689797 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/10_median",
            "value": 59.79395172257335,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 59.77752114756057 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_mean",
            "value": 51.45741660778322,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.441985219146495 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/100_median",
            "value": 51.410822986594205,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 51.402194298098 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_mean",
            "value": 56.390268766665486,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.371070033333126 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_IncrementalTranscript/500_median",
            "value": 56.424362899997504,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 56.4109808000012 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_mean",
            "value": 50.727018076662404,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.719442593635506 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/10_median",
            "value": 50.724372587988086,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 50.72306156215262 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_mean",
            "value": 396.68509826346866,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 396.6653165668352 ns\nthreads: 1"
          },
          {
            "name": "BM_ResultAggregator_LatestSegments/100_median",
            "value": 397.6188779076014,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 397.60903172888317 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_mean",
            "value": 4298.988267717774,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 3994.0894846057276 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/1_median",
            "value": 4288.520240763982,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 4002.5950721933464 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_mean",
            "value": 8172.798830868051,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7778.355371238944 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/10_median",
            "value": 8163.234064056093,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7766.155196802917 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_mean",
            "value": 50842.278116751804,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49266.91040547433 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_Submit/100_median",
            "value": 50932.719875000126,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 49182.11759276392 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_mean",
            "value": 35955.8226059761,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20548.78272570577 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/1_median",
            "value": 35784.33240689964,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 20246.517614661 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_mean",
            "value": 102213.85695010837,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34633.60307957138 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_SubmitAndDrain/10_median",
            "value": 103245.10276655985,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 34556.790019408036 ns\nthreads: 1"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_mean",
            "value": 6871.8542055290345,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7033.353455422887 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:2_median",
            "value": 7103.166123826518,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 7162.2798907409415 ns\nthreads: 2"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_mean",
            "value": 11810.61035520619,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11828.905714639523 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:4_median",
            "value": 11204.204558105303,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 11100.877280598694 ns\nthreads: 4"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_mean",
            "value": 20600.855386650783,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 22121.09739825762 ns\nthreads: 8"
          },
          {
            "name": "BM_InferencePool_QueueContention/process_time/real_time/threads:8_median",
            "value": 20736.437068824875,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 21645.130294400453 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_mean",
            "value": 17.314217762698146,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.314080059288717 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/10_median",
            "value": 17.33328434953668,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.333264024311397 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_mean",
            "value": 17.404814693146765,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.404118588452242 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/50_median",
            "value": 17.425286299924238,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.425118775637536 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_mean",
            "value": 17.447083811933087,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.44692676022972 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_CheckoutCheckin/100_median",
            "value": 17.492195715253526,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 17.491960397621934 ns\nthreads: 1"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_mean",
            "value": 224.76356201239278,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 446.7134842549715 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:2_median",
            "value": 225.25633644024654,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 446.3949397859631 ns\nthreads: 2"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_mean",
            "value": 311.35086245791337,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 883.3425514465899 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:4_median",
            "value": 308.97473234496175,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 894.5547431699546 ns\nthreads: 4"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_mean",
            "value": 664.6083124999554,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2029.9599158333356 ns\nthreads: 8"
          },
          {
            "name": "BM_ObjectPool_Contention/process_time/real_time/threads:8_median",
            "value": 656.44716125,
            "unit": "ns/iter",
            "extra": "iterations: 3\ncpu: 2030.76379499997 ns\nthreads: 8"
          }
        ]
      }
    ]
  }
}