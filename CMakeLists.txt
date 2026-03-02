cmake_minimum_required(VERSION 3.20)
project(whisperx-streaming-server
    VERSION 0.1.0
    LANGUAGES C CXX
)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# --- Security-hardened compiler flags (applied to our targets only) ---
# These are NOT set globally to avoid breaking third-party code
set(WSS_COMPILE_OPTIONS
    -Wall -Wextra -Wpedantic -Werror
    -Wformat=2 -Wformat-security
    -Wconversion -Wsign-conversion
    -Wnull-dereference
    -Wstack-protector
    -fstack-protector-strong
    -fPIE
    -D_FORTIFY_SOURCE=2
)

if(CMAKE_BUILD_TYPE STREQUAL "Release")
    if(CMAKE_SYSTEM_NAME STREQUAL "Linux")
        set(WSS_LINK_OPTIONS -Wl,-z,relro -Wl,-z,now -pie)
    endif()
endif()

# --- Options ---
option(WHISPER_CUDA "Enable CUDA support for whisper.cpp" OFF)
option(WHISPER_VULKAN "Enable Vulkan support for whisper.cpp" OFF)

# --- whisper.cpp (git submodule) ---
set(WHISPER_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(WHISPER_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
add_subdirectory(third_party/whisper.cpp)

# --- nlohmann/json (header-only, FetchContent) ---
include(FetchContent)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG        v3.11.3
    GIT_SHALLOW    TRUE
)
set(JSON_BuildTests OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(json)

# --- spdlog (header-only, FetchContent) ---
FetchContent_Declare(
    spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG        v1.15.1
    GIT_SHALLOW    TRUE
)
set(SPDLOG_BUILD_EXAMPLE OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(spdlog)

# --- libopus (system or FetchContent) ---
find_package(PkgConfig QUIET)
if(PkgConfig_FOUND)
    pkg_check_modules(OPUS IMPORTED_TARGET opus)
endif()

if(NOT OPUS_FOUND)
    FetchContent_Declare(
        opus
        GIT_REPOSITORY https://gitlab.xiph.org/xiph/opus.git
        GIT_TAG        v1.5.2
        GIT_SHALLOW    TRUE
    )
    set(OPUS_BUILD_TESTING OFF CACHE BOOL "" FORCE)
    set(OPUS_BUILD_PROGRAMS OFF CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(opus)
endif()

# --- libsamplerate (system or FetchContent) ---
if(PkgConfig_FOUND)
    pkg_check_modules(SAMPLERATE IMPORTED_TARGET samplerate)
endif()

if(NOT SAMPLERATE_FOUND)
    FetchContent_Declare(
        libsamplerate
        GIT_REPOSITORY https://github.com/libsndfile/libsamplerate.git
        GIT_TAG        0.2.2
        GIT_SHALLOW    TRUE
    )
    set(LIBSAMPLERATE_EXAMPLES OFF CACHE BOOL "" FORCE)
    set(BUILD_TESTING OFF CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(libsamplerate)
endif()

# --- uWebSockets + uSockets ---
# uSockets is a C library; uWebSockets is header-only C++
set(USOCKETS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/third_party/uWebSockets/uSockets)
add_library(uSockets STATIC
    ${USOCKETS_DIR}/src/bsd.c
    ${USOCKETS_DIR}/src/context.c
    ${USOCKETS_DIR}/src/loop.c
    ${USOCKETS_DIR}/src/socket.c
    ${USOCKETS_DIR}/src/udp.c
    ${USOCKETS_DIR}/src/eventing/epoll_kqueue.c
)
target_include_directories(uSockets PUBLIC ${USOCKETS_DIR}/src)
target_compile_definitions(uSockets PRIVATE LIBUS_NO_SSL)
# Disable strict warnings for third-party C code
target_compile_options(uSockets PRIVATE -w)

# uWebSockets header-only interface
add_library(uWebSockets INTERFACE)
target_include_directories(uWebSockets INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/third_party/uWebSockets/src
)
target_link_libraries(uWebSockets INTERFACE uSockets z)

# --- Main server target ---
add_executable(transcription_server
    src/main.cpp
)

target_include_directories(transcription_server PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

# Apply hardened flags only to our code
target_compile_options(transcription_server PRIVATE ${WSS_COMPILE_OPTIONS})
if(DEFINED WSS_LINK_OPTIONS)
    target_link_options(transcription_server PRIVATE ${WSS_LINK_OPTIONS})
endif()

target_link_libraries(transcription_server PRIVATE
    whisper
    uWebSockets
    nlohmann_json::nlohmann_json
    spdlog::spdlog
)

# Link opus
if(OPUS_FOUND AND TARGET PkgConfig::OPUS)
    target_link_libraries(transcription_server PRIVATE PkgConfig::OPUS)
else()
    target_link_libraries(transcription_server PRIVATE opus)
endif()

# Link samplerate
if(SAMPLERATE_FOUND AND TARGET PkgConfig::SAMPLERATE)
    target_link_libraries(transcription_server PRIVATE PkgConfig::SAMPLERATE)
else()
    target_link_libraries(transcription_server PRIVATE samplerate)
endif()
