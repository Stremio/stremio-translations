group = "com.github.Stremio"
version = "1.44.0"

plugins {
    kotlin("multiplatform")
    id("maven-publish")
    id("com.android.library")
    id("com.google.devtools.ksp")
}

repositories {
    google()
    mavenCentral()
}

val lyricistVersion = "1.4.1"

kotlin {
    android {
        publishLibraryVariants("release")
    }

    @Suppress("UNUSED_VARIABLE")
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("cafe.adriel.lyricist:lyricist:${lyricistVersion}")
            }
        }
        val androidMain by getting
    }
}

android {
    defaultConfig {
        minSdk = 22
        compileSdk = 33
    }

    sourceSets {
        getByName("main") {
            manifest.srcFile("src/androidMain/AndroidManifest.xml")
        }
    }
}

dependencies {
    add("kspCommonMainMetadata", "cafe.adriel.lyricist:lyricist-processor:${lyricistVersion}")
}

// workaround for KSP only in Common Main.
// https://github.com/google/ksp/issues/567
tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinCompile<*>>().all {
    if(name != "kspCommonMainKotlinMetadata") {
        dependsOn("kspCommonMainKotlinMetadata")
    }
}