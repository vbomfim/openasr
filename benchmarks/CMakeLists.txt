add_executable(openasr_benchmarks
    bench_ring_buffer.cpp
)

target_include_directories(openasr_benchmarks PRIVATE
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/src
)

# Mark third-party headers as SYSTEM to suppress warnings from -Werror
get_target_property(_spdlog_inc spdlog::spdlog INTERFACE_INCLUDE_DIRECTORIES)
if(_spdlog_inc)
    target_include_directories(openasr_benchmarks SYSTEM PRIVATE ${_spdlog_inc})
endif()
get_target_property(_json_inc nlohmann_json::nlohmann_json INTERFACE_INCLUDE_DIRECTORIES)
if(_json_inc)
    target_include_directories(openasr_benchmarks SYSTEM PRIVATE ${_json_inc})
endif()
get_target_property(_toml_inc tomlplusplus::tomlplusplus INTERFACE_INCLUDE_DIRECTORIES)
if(_toml_inc)
    target_include_directories(openasr_benchmarks SYSTEM PRIVATE ${_toml_inc})
endif()
get_target_property(_whisper_inc whisper INTERFACE_INCLUDE_DIRECTORIES)
if(_whisper_inc)
    target_include_directories(openasr_benchmarks SYSTEM PRIVATE ${_whisper_inc})
endif()
get_target_property(_prom_inc prometheus-cpp::core INTERFACE_INCLUDE_DIRECTORIES)
if(_prom_inc)
    target_include_directories(openasr_benchmarks SYSTEM PRIVATE ${_prom_inc})
endif()

# Apply hardened compiler flags (same as main target)
target_compile_options(openasr_benchmarks PRIVATE ${WSS_COMPILE_OPTIONS})

target_link_libraries(openasr_benchmarks PRIVATE
    benchmark::benchmark_main
    nlohmann_json::nlohmann_json
    spdlog::spdlog
    tomlplusplus::tomlplusplus
    whisper
    prometheus-cpp::core
)

# Link opus and samplerate (same conditional pattern as tests)
if(OPUS_FOUND AND TARGET PkgConfig::OPUS)
    target_link_libraries(openasr_benchmarks PRIVATE PkgConfig::OPUS)
else()
    target_link_libraries(openasr_benchmarks PRIVATE opus)
endif()
if(SAMPLERATE_FOUND AND TARGET PkgConfig::SAMPLERATE)
    target_link_libraries(openasr_benchmarks PRIVATE PkgConfig::SAMPLERATE)
else()
    target_link_libraries(openasr_benchmarks PRIVATE samplerate)
endif()
